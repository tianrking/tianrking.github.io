
#include <iostream>
#include <iomanip>
#include <Eigen/Dense>

#define KongGe " "
#define mm 0.001


using Eigen::MatrixXd;

using namespace std;
double f, Z_S0, m, H;


double Phi, Omega, Kappa;
struct 
{
	double X, Y, Z;
}S,S0;


struct P_L
{
	double x;
	double y;
};

struct G_L
{
	double X;
	double Y;
	double Z;
};
struct ALl_IN_ONE
{
	double Phi, Omega, Kappa;
	double Phi_FIX, Omega_FIX, Kappa_FIX;
	double X_S, Y_S, Z_S;
}King_0;

MatrixXd Matrix_ALL_IN_ONE(6,1);
void Get_Matrix_ALL_IN_ONE() {
	Matrix_ALL_IN_ONE(0, 0) = King_0.X_S;
	Matrix_ALL_IN_ONE(1, 0) = King_0.Y_S;
	Matrix_ALL_IN_ONE(2, 0) = King_0.Z_S;

	Matrix_ALL_IN_ONE(3, 0) = King_0.Phi;
	Matrix_ALL_IN_ONE(4, 0) = King_0.Omega;
	Matrix_ALL_IN_ONE(5, 0) = King_0.Kappa;
}

void RUN_ALL_IN_ONE() {
	King_0.Phi = 0;
	King_0.Omega = 0;
	King_0.Kappa = 0;
	King_0.X_S = S0.X;
	King_0.Y_S = S0.Y;
	King_0.Z_S = H;
	Get_Matrix_ALL_IN_ONE();
}


void Set_Position_Data(P_L&temp) {
	double a, b;
	cin >> a >> b;
	temp.x = a;
	temp.y = b;
}

void Set_Position_Data(G_L& temp) {
	double a, b, c;
	cin >> a >> b >> c;
	temp.X = a;
	temp.Y = b;
	temp.Z = c;
}
		
void Display_Position(G_L* data) {
	cout << "地面坐标(m)" << KongGe;
	cout << data->X << KongGe << data->Y << KongGe << data->Z << endl;
}

void Display_Position(P_L* data) {
	cout << "像点坐标(mm)" << KongGe;
	//cout << data->x << KongGe << data->y << endl;
	cout << 1000*data->x << KongGe << 1000*data->y << endl;

}

//double f, Z_S0, m, H;
void photo_type_set(double a= 153.24 / 1000,double b=6000) {
	f = a;
	m = b;
	H = m*f;

}

struct Struct_A {
	double a_11, a_12, a_13, a_14, a_15, a_16;
	double a_21, a_22, a_23, a_24, a_25, a_26;
	double a[2][6];
};

void Set_struct_A(Struct_A& AAA,P_L& PL) {
	AAA.a_11 = -f / H;
	AAA.a_12 = 0;
	AAA.a_13 = -PL.x / H;
	AAA.a_14 = -f * (1 + pow(PL.x, 2) / pow(f, 2));
	AAA.a_15 = -PL.x *PL.y / f;
	AAA.a_16 = PL.y;
	AAA.a_21 = 0;
	AAA.a_22 = -f / H;
	AAA.a_23 = -PL.y / H;
	AAA.a_24 = -PL.x *PL.y / f;
	AAA.a_25 = -f * (1 + pow(PL.y, 2) / pow(f, 2));
	AAA.a_26 = -PL.x;

	AAA.a[0][0] = AAA.a_11;
	AAA.a[0][1] = AAA.a_12;
	AAA.a[0][2] = AAA.a_13;
	AAA.a[0][3] = AAA.a_14;
	AAA.a[0][4] = AAA.a_15;
	AAA.a[0][5] = AAA.a_16;
	AAA.a[1][0] = AAA.a_21;
	AAA.a[1][1] = AAA.a_22;
	AAA.a[1][2] = AAA.a_23;
	AAA.a[1][3] = AAA.a_24;
	AAA.a[1][4] = AAA.a_25;
	AAA.a[1][5] = AAA.a_26;

}

MatrixXd Matrix_A(2, 6);
void Set_Matrix_Value_A(Struct_A& AAA) {

	for (int _1 = 0; _1 < 2; _1++)
		for (int _2 = 0; _2 < 6; _2++)
			Matrix_A(_1, _2) = AAA.a[_1][_2];
}


struct struct_Phi_Omega_Kappa
{
	double a[3];
	double b[3];
	double c[3];
};

void Set_struct_POK(struct_Phi_Omega_Kappa &POK) {
	POK.a[0] = 1;
	POK.a[1] = 0;
	POK.a[2] = 0;
	POK.b[0] = 0;
	POK.b[1] = 1;
	POK.b[2] = 0;
	POK.c[0] = 0;
	POK.c[1] = 0;
	POK.c[2] = 1;
}

struct Struct_L {
	double x, y;
}l;

void Get_x0_y0_z0(Struct_L &LLL,struct_Phi_Omega_Kappa& POK, G_L& GL,P_L&PL) {
	int nnnn = 0;
	double temp_x_1 = POK.a[nnnn] * (GL.X - S0.X) + POK.b[nnnn] * (GL.Y - S0.Y) + POK.c[nnnn] * (GL.Z - S0.Z); //fenzi
	nnnn = 2;
	double temp_x_2 = POK.a[nnnn] * (GL.X - S0.X) + POK.b[nnnn] * (GL.Y - S0.Y) + POK.c[nnnn] * (GL.Z - S0.Z); //fenmu
	double temp_x = temp_x_1 / temp_x_2;
	nnnn = 1;
	double temp_y_1 = POK.a[nnnn] * (GL.X - S0.X) + POK.b[nnnn] * (GL.Y - S0.Y) + POK.c[nnnn] * (GL.Z - S0.Z); //fenzi
	nnnn = 2;
	double temp_y_2 = POK.a[nnnn] * (GL.X - S0.X) + POK.b[nnnn] * (GL.Y - S0.Y) + POK.c[nnnn] * (GL.Z - S0.Z); //fenmu
	double temp_y = temp_y_1 / temp_y_2;
	LLL.x = PL.x-temp_x;
	LLL.y = PL.y-temp_y;
}


MatrixXd Matrix_l(2, 1);
void Set_Matrix_Value_L(Struct_L&LLL) {
	
	Matrix_l(0, 0) = LLL.x;
	Matrix_l(1, 0) = LLL.y;
}




int main()
{
	int n = 4;
	
	photo_type_set(); //mm->m

	P_L* P = new P_L[n];
	////P_L P_1, P_2, P_3, P_4;
	G_L* G = new G_L[n];
	////G_L G_1, G_2, G_3, G_4;
	Struct_A* Point = new Struct_A[n];

	P[0].x = -86.15 * 0.001;
	P[0].y = -68.99 * 0.001;

	P[1].x = -53.40 * 0.001;
	P[1].y = 82.21 * 0.001;

	P[2].x = -14.78 * 0.001;
	P[2].y = -76.63 * 0.001;

	P[3].x = 10.46 * 0.001;
	P[3].y = 64.43 * 0.001;

	G[0].X = 36589.41;
	G[0].Y = 25273.32;
	G[0].Z = 2195.17;

	G[1].X = 37631.08;
	G[1].Y = 31324.51;
	G[1].Z = 728.69;
	
	G[2].X = 39100.97;
	G[2].Y = 24934.98;
	G[2].Z = 2386.50;

	G[3].X = 40426.54;
	G[3].Y = 30319.81;
	G[3].Z = 757.31;


	for (int i = 0; i < n; i++) {
		Display_Position(G + i);
	}
	for (int i = 0; i < n; i++) {
		Display_Position(P + i);
	}


	//////    S0.X S0.Y S0.Z 初始化
	S0.X = 0;
	for (int i = 0; i < n; i++)
	{
		S0.X += (G + i)->X;
	}
	S0.X = S0.X / n;

	S0.Y = 0;
	for (int i = 0; i < n; i++)
	{
		S0.Y += (G + i)->Y;
	}
	S0.Y = S0.Y / n;

	S0.Z = m * f;

	cout << S0.X << KongGe << S0.Y<<KongGe<<S0.Z<<endl;
	
	cout.precision(15);
	cout << m << " " << f << endl;
	
	////_Test();
	//////////////////////////////////////
	//
	//Struct_A idiot_AA;
	//Set_struct_A(idiot_AA, P[0]);
	//Set_Matrix_Value_A(idiot_AA);

	////Struct_L idiot_LL;
	////Set_struct_L(idiot_LL, P[0]);
	////Set_Matrix_Value_L(idiot_LL);*/
	//struct_Phi_Omega_Kappa idiot_POK;
	//Set_struct_POK(idiot_POK);
	//Struct_L idiot_LL;
	//Get_x0_y0_z0(idiot_LL, idiot_POK, G[0]);
	//Set_Matrix_Value_L(idiot_LL);
	//


	////cout << "A \n" << Matrix_A << endl;
	//MatrixXd temp1 = (Matrix_A.transpose() * Matrix_A);
	////cout << "ATA \n" <<temp1<<endl;
	//temp1 = temp1.inverse();
	////cout << "ATA_1 \n" << temp1 << endl;
	//MatrixXd temp2 = Matrix_A.transpose()*Matrix_l;
	//MatrixXd temp = temp1 * temp2;
	//cout <<setprecision(10)<< "X \n"<<temp<<endl;
	/////////////////////





	/*Struct_A idiot_AA;
	Struct_L idiot_LL;
	MatrixXd real_temp;*/

	//for (int i = 0; i < n; i++) {
	//	
	//	Set_struct_A(idiot_AA, P[i]);
	//	Set_Matrix_Value_A(idiot_AA);

	//	
	//	Set_struct_L(idiot_LL, P[i]);
	//	Set_Matrix_Value_L(idiot_LL);

	//	MatrixXd temp = (Matrix_A.transpose() * Matrix_A);
	//	cout << "A \n" << Matrix_A << endl;
	//	temp = temp.inverse();
	//	temp = temp * Matrix_A.transpose();

	//	cout << "(A.transpose*A).inverse \n" << temp << endl;
	//	cout << "L \n" << Matrix_l << endl;
	//	temp = temp * Matrix_l;
	//	cout << "X \n" << temp << endl;
	//	if (i == 0)
	//		real_temp = temp;
	//	else
	//		real_temp = real_temp + temp;
	//}

	/////////////////////////////////////////////////////////////////////////
	MatrixXd last_value(6,1);
	last_value.setZero();
	last_value(0, 0) = S0.X;
	last_value(1, 0) = S0.Y;
	last_value(2, 0) = S0.Z;
	last_value(3, 0) = Phi;
	last_value(4, 0) = Omega;
	last_value(5, 0) = Kappa;
	cout << last_value<<endl;
	for (int uu=0; uu < n; uu++) {
		

		Struct_A idiot_AA;
		Set_struct_A(idiot_AA, P[uu]);
		Set_Matrix_Value_A(idiot_AA);

		struct_Phi_Omega_Kappa idiot_POK;
		Set_struct_POK(idiot_POK);
		Struct_L idiot_LL;
		Get_x0_y0_z0(idiot_LL, idiot_POK, G[uu],P[uu]);
		Set_Matrix_Value_L(idiot_LL);


		//cout << "A \n" << Matrix_A << endl;
		MatrixXd temp1 = (Matrix_A.transpose() * Matrix_A);
		//cout << "ATA \n" << temp1 << endl;
		MatrixXd temp2 = temp1.inverse();
		
		//cout << "ATA_1 \n" << temp2 << endl;
		MatrixXd temp3 = Matrix_A.transpose() * Matrix_l;
		MatrixXd temp = temp2 * temp3;
		//cout << setprecision(10) << "X \n" << temp << endl;

		cout <<uu<<KongGe<< temp<<endl;
		/*for (int hhh = 0; hhh < 6; hhh++) {
			last_value(hhh, 0) += temp(hhh, 0);
		}*/

	}
	//cout << last_value;
	//////////////////////////////////////////////


	//cout << "Finally_fix\n "<<real_temp<<endl;
	//RUN_ALL_IN_ONE();
	//cout << "O000\n" << Matrix_ALL_IN_ONE << endl;


	//cout << "Result \n" << Matrix_ALL_IN_ONE + real_temp << endl;

	return 0;
	
}

