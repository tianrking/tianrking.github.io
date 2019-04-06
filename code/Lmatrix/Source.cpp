#pragma once
#include <iostream>
#include "Lmatrix.h"
using namespace std;




template <class T>
T LowerMatrix<T>::GetElem(int i, int j)
{
	if (i >= j)
		return M[i * (i - 1) / 2 + j - 1];

	else
		return 0;

}

template<class T>
void LowerMatrix<T>::Input()
{
	for (int i = 0; i < n * (n - 1) / 2 - 1; i++)
		cin >> M[i];
}

template <class T>
void LowerMatrix<T>::Print()
{
	for (int i = 1; i <= n; i++)
		for (int j = 1; j <= i; j++) 
			cout << GetElem(i, j) << " ";
		cout << endl;
}