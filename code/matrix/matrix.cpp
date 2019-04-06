#include "matrix.h"
#include <iostream>
using namespace std;


template <class T>
Matrix<T>::Matrix(int r, int c)
{
	rows = r;
	cols = c;
	melem = new T[r * c];
}

template<class T>
Matrix<T>::Matrix(Matrix<T>& m)
{
	rows = m.rows;
	cols = m.cols;
	for (int i = 0; i < rows * cols; i++)
	{
		melem[i] = m.melem[i];
	}
}

template<class T>
Matrix<T>& Matrix<T>::operator=(Matrix<T>& m)
{
	rows = m.rows;
	cols = m.cols;
	for (int i; i < rows * cols; i++)
	{
		melem[i] = m.melem[i];
	}
}

template<class T>
T& Matrix<T>::operator()(int i, int j)
{
	return melem[(i - 1) * rows + j - 1];
}

template<class T>
Matrix<T>  Matrix<T>::operator+(Matrix<T>& B)
{
	if (rows != B.rows || cols != B.cols)
	{
		cout << "wrong" << endl;
		return -1;
	}
	Matrix<T> C(rows, cols);
	for (int i = 0; i < cols * rows; i++)
	{
		C.melem[i] = melem[i] + B.melem[i];
	}
	return C;
}

template<class T>
Matrix <T>  Matrix<T>::operator-(Matrix<T>& B)
{
	if (rows != B.rows || cols != B.cols)
	{
		cout << "wrong" << endl;
		return -1;
	}
	Matrix<T> C(rows, cols);
	for (int i = 0; i < cols * rows; i++)
	{
		C.melem[i] = melem[i] - B.melem[i];
	}
	return C;
}

template<class T>
Matrix <T>  Matrix<T>::operator*(Matrix<T>& B)
{
	if (cols != B.rows) {
		cout << "wrong"<<endl;
		return -1;
	}
	Matrix<T> C(rows, B.cols);
	int ca = 0, cb = 0, cc = 0;
	for (int i = 1; i <= rows; i++)
	{
		for (int j = 1; j <cols; j++) // Maybe <= :))) ojbk fix 1 p99
		{
			T sum = melem[ca] * B.melem[cb];
			for (int k = 2; k <= cols; k++) {
				ca++;
				cb += B.cols;
				sum += melem[ca] * B.melem[cb];
			}

			C.melem[cc++] = sum;
			ca -= cols - 1;
			cb = j;

		}
		ca += cols;
		cb = 0;
	}
	return C;
}

template <class T>
void  Matrix<T>::Input()
{
	for (int i = 0; i < rows * cols; i++)
	{
		cin >> melem[i];
	}
}

template <class T>
void  Matrix<T>::Print()
{
	for (int i = 0; i < rows * cols; ) //ojnk fix 2 p100
	{
		cout << melem[i]<<" " ;
		i++;
		if (i % cols == 0)
		{
			cout << endl;

		}
	
	}
}

template<class T>
void transmat(Matrix <T>& a, Matrix<T>& b)
{
	int i, j;
	for (i = 1; i <= a.rows; i++) {
		for (j = 1; j <= a.cols; j++) {
			a(i, j) = b(j, i);
		}
	}
}