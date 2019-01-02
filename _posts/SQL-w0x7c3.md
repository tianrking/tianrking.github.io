---
title: SQL(w0x7c3)
date: 2018-10-26 22:46:55
tags:
---


    select sno,sn,age from s
    select * from sc
    select sn name, sno,age from s /*select sn as name ,sno ,age*/
    /*条件查询*/
    select SNo,score from sc where cno='c1'   
    select sno,cno,score from sc where score > 85
    select SNo,score from sc where( cno='c1' or cno='c2') and score > 85 
    /**/
    select tno,tn,prof from t where sal between 1000 and 1500
    select tno,tn,prof from t where sal not between 1000 and 1500

    select tno,tn from t where tn like '张%'
    select tno,tn from t where tn like '%'
    select tno,tn from t where tn like '_雪'

    /*avg() sum() max() min() count() */
    select sum(score) as totalscore ,avg(score) as avgscore from sc where sno='s1'

    /* c1最高分 最低分 之间相差分数 */
    select max(score) as MaxScore ,min (score) as MixScore ,Max(Score)-Min(Score) as diff       from sc where (cno='c1') 

    select count(*) from  s where dept='计算机' 
    /*distinct消除重复行 count对null不计算 对0计算*/
    select count(distinct dept) as deptnum from s 

    select count(*) from s where dept='计算机'

    /* Group by 分组查询 */
    select tno,count (*) as C_Num from tc Group by tno

    select Sno , count (*) as sc_num from sc group by sno having (count(*) >=2 )


    select sno,cno,score from sc where cno in ('c2','c3','c4','c5') order by sno,score desc

    select X.TN,X.sal as Sal_a,Y.Sal as Sal_b from T as x,T as Y where X.Sal> Y.Sal and Y.TN='刘伟'

    /*返回一个值的普通子查询*/
    select tno,tn from t where prof =( Select prof From T where Tn='刘伟')

    /*返回一组值的普通子查询*/

    /*Any*/
    select tn from t where (tno = any (select tno from tc where cno='c5'))
    /*In可以代替 '=any'*/
    /*all*/
    select tn,sal from t where (sal > all(select sal from t where dept='计算机'))

    select Tn,Sal from T where (Sal > (Select Max(sal) from t where dept='计算机')) and (Dept <> '计算机')


    /*相关子查询*/

    /*not in 代替 <> all*/

    /*查看选修所有课程的学生姓名 【搜索不存在没有选课信息学生的姓名】*/
    select sn from s where (not exists (select * from c where not exists( select * from sc where sno=s.sno and cno=c.cno)))


    /*存储查询结构到表中*/
    select sno as 学号 ,sum(score ) as 总分 into #cal_table from sc group by sno 

    /*数据表数据操纵*/

    insert into s (sno,sn,age,sex,dept) values ('s7','插入哥',21,'男','失业群众')

    /*添加一行记录的部分数据值*/
    insert into sc (sno,cno) values ('s7','c1')


    /*添加多行记录*/  
    /*                    點解                              */
     /*                    點解                              */
      /*                    點解                              */
        /*                    點解                              */
	      /*                    點解                              */
	        /*                    點解                              */
	          /*                    點解                              */
	          /*                    點解                              */
		 /*                    點解                              */

    create table avgval
    (
	    department varchar(20),
	    average smallint
    )
    insert into avgval select dept,avg (sal) from t group by dept

      /*                    點解                              */
     /*                    點解                              */
      /*                    點解                              */
        /*                    點解                              */
	      /*                    點解                              */
	        /*                    點解                              */
	          /*                    點解                              */
	          /*                    點解                              */
		 /*                    點解                              */


    /*用sql命令修改数据*/


    /*把刘伟老师转移到信息系*/
      update t set dept='信息' where tn= '刘伟' 

    /* 将所有学生的年龄增加一岁*/
 
    /*mmp 修改失败？？？？？？？ */
	         /*mmp 修改失败？？？？？？？ */
	          	/*mmp 修改失败？？？？？？？ */
    update s set age=age-1 
            	/*mmp 修改失败？？？？？？？ */
      	  /*mmp 修改失败？？？？？？？ */
    /*mmp 修改失败？？？？？？？ */

    update t set sal=1.2 * sal where (Prof = '讲师' ) and (sal <= 1000)




     /*未测试   未测试*/
        	/* 未测试   未测试*/ 
		      /* 未测试   未测试*/ 

		/* 把讲授c5课程的教师的岗位津贴增加100元 */
    update t set Comm = Comm + 100 where (tno in (select tno from t, tc where t.tno = tc.tno and tc.cno = 'c5'))
	  	/* 把所有教师的工资提高到平均工资的1.2倍*/
    update t set sal = ( select 1.2 * avg (sal)) from t)	
		
		
		
		    /* 删除数据 */ 
    delete from where tn = '刘伟'
		  /* 删除所有老师的授课记录 */
    delete from tc 
		/*删除刘伟老师授课*/
    delete from tc where (tno =( select tno from t where tn='刘伟'))
		

		  /*视图*/
		


		  / * 未测试   未测试*/ 
	      /* 未测试   未测试*/ 
    /*未测试   未测试*/
       /* 视图 */
	         /* 视图 */
	              /*创建一个计算机系教师情况的视图Sub_T*/
    create view Sub_T AS select Tno ,Tn ,Prof from t where dept = '计算机'
	              / * 创建一个学生平均成绩视图S_Avg */
    create view S_avg(Sno,Avg) as select sno,avg (Score) from sc group by sno

	    /* 视图 */
     /* 视图 */



{% aplayer " One Sweet Day" "Mariah Care" "/root-images/onesweetday.mp3" "autoplay" %}
 








































