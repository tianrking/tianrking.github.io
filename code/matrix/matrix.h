#pragma once
#include<iostream>
using namespace std;

template<class T>
class Matrix
{
public:
	Matrix(int r=0,int c=0);
	Matrix(Matrix<T>& m);
	~Matrix() { delete[]melem; };
	void Input();
	void Print();
	T& operator() (int i, int j);
	Matrix <T>& operator=(Matrix <T>& m);
	Matrix <T>operator+(Matrix <T>& m);
	Matrix <T>operator-(Matrix <T>& m);
	Matrix <T>operator*(Matrix <T>& m);
	void transmat(Matrix <T>& b);
	friend void transmat(Matrix <T>& a, Matrix<T>& b);
private:
	int rows, cols;
	T* melem;

};




