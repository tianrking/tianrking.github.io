---
title: stupid
date: 2019-03-19 18:48:55
tags:
---

```
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
		//glClear(GL_COLOR_BUFFER_BIT); //清除颜色
		//glBegin(GL_LINE_LOOP);//GL_POLYGON表示画多边形（由点连接成多边形） GL_LINE_LOOP不填充多边形
		/*int n;
		cin >> n;
		for (i = 0; i < n; ++i)
			glVertex2f(R*cos(2 * Pi / n * i), R*sin(2 * Pi / n * i));
		*/
		//glVertex2f(0, 0.5);
		//glVertex2f(0, -0.5);
		//glVertex2f(0.6, 0);
		GLfloat x = -1.0;
		glClear(GL_COLOR_BUFFER_BIT);
		/*glBegin(GL_LINES);
		glColor3f(0.0f, 1.0f, 0.0f);
		glVertex2f(-1.0f, 0.0f);  //过中心的十字
		glVertex2f(1.0f, 0.0f);
		glVertex2f(0.0f, -1.0f);
		glVertex2f(-0.0f, 1.0f);

		glEnd();
		*/
		//glBegin(GL_LINE_STRIP);
		/*for (float x = -5 * Pi; x < 5 * Pi; x += 0.1f)
		{
			glVertex2f(x / (5 * Pi), sin(x));
		}*/
		//glColor3f(0.0f, 1.0f, 0.0f);
		
		float dr = 0.1f;
		for (float r = 0; r < 1; r += dr) {
			glBegin(GL_LINE_STRIP);
			glColor3f(0.0f, 1.0f, 0.0f);
			for (float x = -r; x < r; x += 0.01f)
			{

				glVertex2f(x, sqrt(r*r - x * x));
			}
			glEnd();
			//glFlush();
		}
		//glEnd();
		//glFlush();

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
			//glFlush();
		}
		//glFlush();
		
		glClearColor(0, 0, 0, 0);
		//glColor4f(0, 0, 1, 0);
		float dR=0.1f;
		int t,g;
		//cin >> t;
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
	

		
		//glEnd();

		//glFlush();//保证前面的OpenGL命令立即执行（而不是让它们在缓冲区中等待）
	}
}



int main(int argc, char *argv[])
{
	system("color B");
	cout << "I can fix what stupid does,however cannot fix stupid" << endl;
	glutInit(&argc, argv);//对GLUT进行初始化，这个函数必须在其它的GLUT使用之前调用一次
	glutInitDisplayMode(GLUT_RGB | GLUT_SINGLE); //设置显示方式
	glutInitWindowPosition(100, 100);
	glutInitWindowSize(500, 500);
	glutCreateWindow("w0x7ce"); //根据前面设置的信息创建窗口。参数将被作为窗口的标题。

	int x1 = ::MessageBox(NULL, TEXT("Start？"), TEXT("0.0"), MB_OKCANCEL);
	if (x1 == 1)
	{
		cout << "Plz wait for a moment :)  10s "<<endl<<"Then Plz enter time 4 rotate:___\b\b\b";
		cin >> ooo;
		cout << "Enter the stupid speed:___(Hz)\b\b\b\b\b\b\b";
		cin >> nnn;
		
		glutDisplayFunc(&Displayx); //当需要画图时，请调用myDisplay函数
		glutMainLoop(); //进行一个消息循环
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