// External Sites Data - Unified data structure for all external websites/projects
// Add new sites here to automatically appear on the External Labs page

export const externalSitesData = {
  lab: {
    title: 'External Labs',
    description: 'A curated collection of my external projects, experiments, and web applications',
    icon: '🔗',
    color: '#f97316',
  },
  categories: [
    {
      id: 'ai',
      name: 'AI Lab',
      icon: '🤖',
      description: 'AI and Machine Learning projects',
      color: '#8b5cf6',
      sites: [
        {
          id: 'chatgpt-web',
          name: 'ChatGPT Web',
          description: 'A beautiful ChatGPT web interface built with modern technologies',
          url: 'https://chat.tianrking.com',
          screenshot: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
          tags: ['AI', 'ChatGPT', 'React', 'Node.js'],
          featured: true,
        },
        // Add more AI projects here
      ],
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: '🛠️',
      description: 'Useful tools and utilities',
      color: '#3b82f6',
      sites: [
        {
          id: 'json-formatter',
          name: 'JSON Formatter',
          description: 'Online JSON formatting and validation tool',
          url: 'https://json.tianrking.com',
          screenshot: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
          tags: ['JSON', 'Tools', 'Web'],
          featured: true,
        },
        // Add more tools here
      ],
    },
    {
      id: 'demos',
      name: 'Demos',
      icon: '🎮',
      description: 'Interactive demos and experiments',
      color: '#10b981',
      sites: [
        {
          id: 'particle-demo',
          name: 'Particle System',
          description: 'Interactive particle system visualization',
          url: 'https://particles.tianrking.com',
          screenshot: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
          tags: ['Canvas', 'Animation', 'JavaScript'],
          featured: false,
        },
        // Add more demos here
      ],
    },
    {
      id: 'experiments',
      name: 'Experiments',
      icon: '🧪',
      description: 'Technical experiments and prototypes',
      color: '#ec4899',
      sites: [
        {
          id: 'webgl-terrain',
          name: 'WebGL Terrain',
          description: '3D terrain generation using WebGL',
          url: 'https://terrain.tianrking.com',
          screenshot: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=400&fit=crop',
          tags: ['WebGL', '3D', 'Terrain'],
          featured: true,
        },
        // Add more experiments here
      ],
    },
    {
      id: 'archived',
      name: 'Archived',
      icon: '📦',
      description: 'Archived and legacy projects',
      color: '#6b7280',
      sites: [
        {
          id: 'old-portfolio',
          name: 'Old Portfolio',
          description: 'My previous portfolio website',
          url: 'https://v1.tianrking.com',
          screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
          tags: ['Portfolio', 'Archive'],
          featured: false,
        },
        // Add more archived projects here
      ],
    },
  ],
};
