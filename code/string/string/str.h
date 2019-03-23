#pragma once
#include <iostream>
class SeqString
{
public:
	SeqString();
	~SeqString();
	SeqString(int MaxStrSize = 256);
	SeqString(char *);
	SeqString(SeqString &t);
	int StrLength();
	int StrCom(SeqString t);
	void StrCon(SeqString s, SeqString t);
	int index(SeqString t);
	void SubStr(SeqString s, int start, int len);
	friend void Insert(SeqString &S, SeqString S1, int i);

	void PrintStr() {
		std::cout << str << std::endl;
	}
private:
	int MaxSize;
	char *str;
};



