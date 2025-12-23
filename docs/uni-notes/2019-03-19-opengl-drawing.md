---
title: "OpenGL 绘图程序"
date: 2019-03-19
tags: []
category: "代码练习"
description: "使用OpenGL绘制旋转图形的C++程序代码"
---

:::note Archived University Note
This content is from my university archives and may not be reliable or up-to-date.
:::

## OpenGL 绘图程序

这是一个使用OpenGL绘制的旋转五边形动画程序。

```cpp
// stupid.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include "pch.h"
#include <iostream>
using namespace std;
#include <GL/glut.h>
#include <windows.h>
#include <math.h>

const GLfloat Pi = 3.1415926536f;
int ooo;
float nnn;

void Displayx(void)
{
	while (true) {
		int i;

		GLfloat x = -1.0;
		glClear(GL_COLOR_BUFFER_BIT);

		float dr = 0.1f;
		for (float r = 0; r < 1; r += dr) {
			glBegin(GL_LINE_STRIP);
			glColor3f(0.0f, 1.0f, 0.0f);
			for (float x = -r; x < r; x += 0.01f)
			{
				glVertex2f(x, sqrt(r*r - x * x));
			}
			glEnd();
		}

		glBegin(GL_LINE_STRIP);
		glColor3f(0.0f, 1.0f, 0.0f);
		for (float r = 0; r < 1; r += dr) {
			glBegin(GL_LINE_STRIP);
			glColor3f(0.0f, 1.0f, 0.0f);
			for (float x = -r; x < r; x += 0.01f)
			{
				glVertex2f(x, -sqrt(r*r - x * x));
			}
			glEnd();
		}

		glClearColor(0, 0, 0, 0);
		float dR=0.1f;
		int t,g;
		t = ooo;

		nnn = 1000 / nnn;
		g = t;
		float d_angle = 0.0f;
		for (; t > 0; t--) {
				Sleep(nnn);

				for (float R = 0; R < 1; R += dR) {
					glBegin(GL_LINE_LOOP);

					GLfloat xA = R * cos(90 * 2 * Pi / 360 + d_angle);
					GLfloat yA = R * sin(90 * 2 * Pi / 360 + d_angle);

					GLfloat xB = R * cos(306 * 2 * Pi / 360 + d_angle);
					GLfloat yB = R * sin(306 * 2 * Pi / 360 + d_angle);

					GLfloat xC = R * cos(162 * 2 * Pi / 360 + d_angle);
					GLfloat yC = R * sin(162 * 2 * Pi / 360 + d_angle);

					GLfloat xD = R * cos(18 * 2 * Pi / 360 + d_angle);
					GLfloat yD = R * sin(18 * 2 * Pi / 360 + d_angle);

					GLfloat xE = R * cos(234 * 2 * Pi / 360 + d_angle);
					GLfloat yE = R * sin(234 * 2 * Pi / 360 + d_angle);

					glVertex2f(xA, yA);
					glVertex2f(xB, yB);
					glVertex2f(xC, yC);
					glVertex2f(xD, yD);
					glVertex2f(xE, yE);

					glEnd();

				}
				d_angle += (360.0f / (5.0f *g));
				glFlush();
			}
		return;
	}
}


int main(int argc, char *argv[])
{
	system("color B");
	cout << "I can fix what stupid does,however cannot fix stupid" << endl;
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGB | GLUT_SINGLE);
	glutInitWindowPosition(100, 100);
	glutInitWindowSize(500, 500);
	glutCreateWindow("w0x7ce");

	int x1 = ::MessageBox(NULL, TEXT("Start？"), TEXT("0.0"), MB_OKCANCEL);
	if (x1 == 1)
	{
		cout << "Plz wait for a moment :)  10s" << endl << "Then Plz enter time 4 rotate:___\b\b\b";
		cin >> ooo;
		cout << "Enter the stupid speed:___(Hz)\b\b\b\b\b\b\b";
		cin >> nnn;

		glutDisplayFunc(&Displayx);
		glutMainLoop();
		return 0;
	}
	else
	{
		int x2 = ::MessageBox(NULL, TEXT("Quit？"), TEXT("0.0"), MB_OK);
		cout << "Idiot";
		return 0;
	}

}
```
