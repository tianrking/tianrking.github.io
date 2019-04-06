#pragma once
template<class T>
class LowerMatrix
{
private:
	int n;
	T* M;

public:
	LowerMatrix(int MaxSize = 10) {
		n = MaxSize; M = new T[n * (n + 1) / 2];
	}
	T GetElem(int i, int t);
	void Input();
	void Print();
	~LowerMatrix();
};

