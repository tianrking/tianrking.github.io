def pythonsum(n):
	a=range(n)
	b=range(n)
	c=[]

	for i in range(len(a)):
		a[i]=i**2
		b[i]=i**3
		c.append(a[i]+b[i])

	return c

a=input()
a=int(a)
print(pythonsum(a))