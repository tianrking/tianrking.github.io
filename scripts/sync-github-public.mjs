import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');
const CURATED_PATH = path.join(ROOT_DIR, 'src', 'data', 'featured-projects.json');
const SNAPSHOT_PATH = path.join(ROOT_DIR, 'static', 'data', 'featured-projects.json');
const GITHUB_API = 'https://api.github.com';
const ALLOWED_OWNER = 'tianrking';
const REPOSITORY_NAME_PATTERN = /^[A-Za-z0-9_.-]+$/;

const githubToken = process.env.GITHUB_TOKEN?.trim();

function requestHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2026-03-10',
    'User-Agent': 'tianrking.github.io-project-snapshot',
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  return headers;
}

async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT' && fallback !== null) {
      return fallback;
    }
    throw error;
  }
}

function repositoryList(project) {
  const repositories = project.repositories ?? (project.repo ? [project.repo] : []);
  if (repositories.length === 0) {
    throw new Error(`Project ${project.id} has no repository allowlist entry.`);
  }
  return repositories;
}

function validateRepositoryEntry(repository, projectId) {
  if (
    repository.owner !== ALLOWED_OWNER ||
    !REPOSITORY_NAME_PATTERN.test(repository.name ?? '')
  ) {
    throw new Error(`Project ${projectId} contains a repository outside the allowlist.`);
  }
}

function validateCuratedProjects(projects) {
  if (!Array.isArray(projects) || projects.length !== 6) {
    throw new Error('Exactly six curated featured projects are required.');
  }

  const ids = new Set();
  for (const project of projects) {
    if (!project.id || ids.has(project.id)) {
      throw new Error(`Featured project id is missing or duplicated: ${project.id ?? '(missing)'}`);
    }
    ids.add(project.id);
    repositoryList(project).forEach((repository) =>
      validateRepositoryEntry(repository, project.id),
    );
  }
}

function canonicalRepositoryUrl(owner, name) {
  return `https://github.com/${owner}/${name}`;
}

function isAllowedRepositoryUrl(candidate, owner, name) {
  try {
    const url = new URL(candidate);
    return (
      url.protocol === 'https:' &&
      url.hostname === 'github.com' &&
      url.pathname.replace(/\/$/, '').toLowerCase() ===
        `/${owner}/${name}`.toLowerCase()
    );
  } catch {
    return false;
  }
}

function isAllowedReleaseUrl(candidate, owner, name) {
  if (!candidate) return false;
  try {
    const url = new URL(candidate);
    return (
      url.protocol === 'https:' &&
      url.hostname === 'github.com' &&
      url.pathname.toLowerCase().startsWith(`/${owner}/${name}/releases/`.toLowerCase())
    );
  } catch {
    return false;
  }
}

async function githubRequest(apiPath, {allowNotFound = false} = {}) {
  const response = await fetch(`${GITHUB_API}${apiPath}`, {
    headers: requestHeaders(),
    signal: AbortSignal.timeout(15_000),
  });

  if (allowNotFound && response.status === 404) return null;
  if (!response.ok) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    throw new Error(`GitHub REST returned ${response.status} (remaining: ${remaining ?? 'unknown'}).`);
  }

  return response.json();
}

async function fetchRepository(repository) {
  const {owner, name} = repository;
  const repo = await githubRequest(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
  );

  if (
    repo.private !== false ||
    repo.owner?.login?.toLowerCase() !== owner.toLowerCase() ||
    repo.name?.toLowerCase() !== name.toLowerCase()
  ) {
    throw new Error(`${owner}/${name} is not the expected public repository.`);
  }
  if (repo.fork && repository.allowFork !== true) {
    throw new Error(`${owner}/${name} is a fork and is excluded by default.`);
  }
  if (!isAllowedRepositoryUrl(repo.html_url, owner, name)) {
    throw new Error(`${owner}/${name} returned a URL outside the allowlist.`);
  }

  const release = await githubRequest(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/releases/latest`,
    {allowNotFound: true},
  );

  const latestRelease =
    release && isAllowedReleaseUrl(release.html_url, owner, name)
      ? {
          name: release.name || release.tag_name,
          tag: release.tag_name,
          publishedAt: release.published_at,
          url: release.html_url,
        }
      : null;

  // Deliberately map only fields used by the public UI. Never serialize the API response.
  return {
    owner,
    name,
    label: repository.label || null,
    fullName: `${owner}/${name}`,
    url: canonicalRepositoryUrl(owner, name),
    description: repo.description || null,
    isPrivate: false,
    isFork: Boolean(repo.fork),
    isArchived: Boolean(repo.archived),
    stars: Number(repo.stargazers_count) || 0,
    forks: Number(repo.forks_count) || 0,
    primaryLanguage: repo.language || null,
    license: repo.license?.spdx_id || null,
    defaultBranch: repo.default_branch,
    pushedAt: repo.pushed_at,
    latestRelease,
    stale: false,
  };
}

function priorRepositoryMap(snapshot) {
  const entries = (snapshot?.projects ?? [])
    .flatMap((project) => project.repositories ?? [])
    .filter((entry) => typeof entry?.fullName === 'string');
  return new Map(entries.map((entry) => [entry.fullName.toLowerCase(), entry]));
}

function lastKnownGoodRepository(previous, repository) {
  const {owner, name} = repository;
  if (
    !previous ||
    previous.isPrivate !== false ||
    (previous.isFork && repository.allowFork !== true) ||
    previous.owner?.toLowerCase() !== owner.toLowerCase() ||
    previous.name?.toLowerCase() !== name.toLowerCase() ||
    !isAllowedRepositoryUrl(previous.url, owner, name)
  ) {
    return null;
  }

  const latestRelease =
    previous.latestRelease &&
    isAllowedReleaseUrl(previous.latestRelease.url, owner, name)
      ? {
          name: previous.latestRelease.name || previous.latestRelease.tag,
          tag: previous.latestRelease.tag,
          publishedAt: previous.latestRelease.publishedAt,
          url: previous.latestRelease.url,
        }
      : null;

  const safeCount = (value) =>
    Number.isFinite(value) && value >= 0 ? Math.trunc(value) : 0;

  // Re-map instead of spreading the file so stale data cannot add public fields.
  return {
    owner,
    name,
    label: repository.label || null,
    fullName: `${owner}/${name}`,
    url: canonicalRepositoryUrl(owner, name),
    description:
      typeof previous.description === 'string' ? previous.description : null,
    isPrivate: false,
    isFork: Boolean(previous.isFork),
    isArchived: Boolean(previous.isArchived),
    stars: safeCount(previous.stars),
    forks: safeCount(previous.forks),
    primaryLanguage:
      typeof previous.primaryLanguage === 'string' ? previous.primaryLanguage : null,
    license: typeof previous.license === 'string' ? previous.license : null,
    defaultBranch:
      typeof previous.defaultBranch === 'string' ? previous.defaultBranch : null,
    pushedAt: typeof previous.pushedAt === 'string' ? previous.pushedAt : null,
    latestRelease,
    stale: true,
  };
}

function projectMetadata(project, repositories) {
  const languages = [...new Set(repositories.map((repo) => repo.primaryLanguage).filter(Boolean))];
  const latestRelease = repositories
    .map((repo) => repo.latestRelease)
    .filter(Boolean)
    .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))
    .at(-1) ?? null;
  return {
    id: project.id,
    title: project.title,
    summary: project.summary,
    category: project.category,
    status: project.status,
    tags: project.tags,
    github: {
      url: repositories[0].url,
      stars: repositories.reduce((total, repo) => total + repo.stars, 0),
      forks: repositories.reduce((total, repo) => total + repo.forks, 0),
      languages,
      latestRelease,
      latestPushAt:
        repositories.map((repo) => repo.pushedAt).filter(Boolean).sort().at(-1) ?? null,
      stale: repositories.some((repo) => repo.stale),
    },
    repositories,
  };
}

async function main() {
  const curatedProjects = await readJson(CURATED_PATH);
  validateCuratedProjects(curatedProjects);

  const previousSnapshot = await readJson(SNAPSHOT_PATH, {projects: []});
  const previousRepositories = priorRepositoryMap(previousSnapshot);
  let refreshedCount = 0;
  const staleRepositories = [];

  const projects = [];
  for (const project of curatedProjects) {
    const repositories = [];
    for (const repository of repositoryList(project)) {
      const fullName = `${repository.owner}/${repository.name}`;
      try {
        repositories.push(await fetchRepository(repository));
        refreshedCount += 1;
      } catch (error) {
        const previous = lastKnownGoodRepository(
          previousRepositories.get(fullName.toLowerCase()),
          repository,
        );
        if (!previous) {
          throw new Error(`${fullName} could not be refreshed and has no last-known-good entry: ${error.message}`);
        }
        repositories.push(previous);
        staleRepositories.push(fullName);
        console.warn(`Using last-known-good metadata for ${fullName}: ${error.message}`);
      }
    }
    projects.push(projectMetadata(project, repositories));
  }

  if (refreshedCount === 0 && previousSnapshot.projects?.length) {
    console.warn('GitHub was unavailable; the last-known-good snapshot was left unchanged.');
    return;
  }

  const snapshot = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: 'GitHub public REST API',
    staleRepositories,
    projects,
  };

  await mkdir(path.dirname(SNAPSHOT_PATH), {recursive: true});
  await writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(
    `Wrote ${projects.length} projects (${refreshedCount} repositories refreshed) to ${path.relative(ROOT_DIR, SNAPSHOT_PATH)}.`,
  );
}

await main();
