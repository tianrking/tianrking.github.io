{% raw %}
<html>
        <title>LBH≒XYZ</title>
        <script>
        var br="<br>";
        var a,b,c,f,e,e_,e2,e_2,Logg,time;
        Logg=[];
        
        function cc(){
               var o_x=document.getElementById("input").value;
               document.write(o_x); 
               document.write(br); 
               
            }
    function set_type_1954(){
        a=6378245;
        b=6356863.0188;
        c=6399698.9018;
        f=0.00335232986926;
        e2=0.00669342162297;
        e_2=0.00673852541468;
        time=1;
     }
     function set_type_IUGG1975(){
        a=6378140;
        b=6356755.2882;
        c=6399596.6520;
        f=0.00335281317790;
        e2=0.00669438499959;
        e_2=0.00673950181947;
        time=1;
     }
     function set_type_CGCS2000(){
        a=6378137;
        b=6356752.31414;
        c=6399593.62586;
        f=1/298.257222101;
        e2=0.00669438002290;
        e_2=0.00673949677548;
        time=1;
     }


    function change_type(value){
        value = Math.abs(value);
        var v1 = Math.floor(value);//度
        var v2 = Math.floor((value - v1) * 60);//分
        var v3 = ((value - v1) * 3600 % 60);//秒
        return v1 + '°' + v2 + '\'' + v3 + '"';
    }

    function XYZ_LBH(_1,_2,_3){
       
        var X=_1;
        var Y=_2;
        var Z=_3;
        
        var L=Math.atan(Y/X);
        var tanB_temp=Z/(Math.sqrt(X*X+Y*Y));// tanB_0
        var tanB=tanB_temp;
        while(1){
            tanB=(Z+a*e2*tanB/Math.sqrt(1+tanB*tanB*(1-e2)))/(Math.sqrt(X*X+Y*Y));
           
            Logg[time]=change_type(Math.atan(tanB)*180/Math.PI)+br;
            if(Math.abs(tanB-tanB_temp)<(0.0001/3600)){
                break;
            }
            tanB_temp=tanB;
            time++;
            
        }

        var L=change_type(L*180/Math.PI);
        var B=change_type(Math.atan(tanB)*180/Math.PI);
       
        var W=Math.sqrt(1-e2*Math.pow(Math.sin(Math.atan(tanB)),2));
        var N=a/W;
        var H=Math.sqrt(X*X+Y*Y)/Math.cos(Math.atan(tanB))-N;
        document.write(L+br+B+br+H+br+br);
        for(var i=1;i<=time;i++){
            document.write(i+"﹚"+" "+Logg[i]);
        }

        document.write(br);
        
    }
    var readX,readY,readZ;
    function Start_XYZ_LBH(){
        readX=document.getElementById("inputx/l").value;
        readY=document.getElementById("inputy/b").value;
        readZ=document.getElementById("inputz/h").value;
        
        set_type_1954();
        document.write("1954"+br);
        XYZ_LBH(parseFloat(readX),parseFloat(readY),parseFloat(readZ));
        
        set_type_CGCS2000();
        document.write("CGCS2000"+br);
        XYZ_LBH(parseFloat(readX),parseFloat(readY),parseFloat(readZ));

        set_type_IUGG1975();
        document.write("IUGG1975"+br);
        XYZ_LBH(parseFloat(readX),parseFloat(readY),parseFloat(readZ));
    }


    var readL,readB,readH;
    function Start_LBH_XYZ(){
        readL=document.getElementById("inputx/l").value;
        readB=document.getElementById("inputy/b").value;
        readH=document.getElementById("inputz/h").value;

        set_type_1954();
        document.write("1954"+br);
        LBH_XYZ(readL,readB,readH);

        set_type_CGCS2000();
        document.write("CGCS2000"+br);
        LBH_XYZ(readL,readB,readH);

        set_type_IUGG1975();
        document.write("IUGG1975"+br);
        LBH_XYZ(readL,readB,readH);


    }

    function change_type_Back(value){
         ///<summary>度分秒转换成为度</summary>
        var du = value.split("°")[0];
        var fen = value.split("°")[1].split("'")[0];
        var miao = value.split("°")[1].split("'")[1].split('"')[0];
        return parseFloat(du)+parseFloat(fen)/60+parseFloat(miao)/3600;
    }

    function LBH_XYZ(_1,_2,_3){
        var L=parseFloat(change_type_Back(_1)*Math.PI/180);
        var B=parseFloat(change_type_Back(_2)*Math.PI/180);
        var H=_3;

        var W=Math.sqrt(1-e2*Math.pow(Math.sin(B),2));
        var N= a/W;

        var X=(parseFloat(N)+parseFloat(H))*Math.cos(B)*Math.cos(L); //var X=OP2*Math.cos(L);
        var Y=(parseFloat(N)+parseFloat(H))*Math.cos(B)*Math.sin(L); //var X=OP2*Math.sin(L) ; 
        var Z=(parseFloat(N)*(1-e2)+parseFloat(H))*Math.sin(B);

        document.write(X+br+Y+br+Z+br+br);
    
    }
   
    function test(){
        alert("😀");
       
    }


</script>
<form >
    <input type="text" id="inputx/l" placeholder="Input X/L" value="1177888.777">
    <input type="text" id="inputy/b" placeholder="Input Y/B" value="5166777.888">
    <input type="text" id="inputz/h" placeholder="Input Z/H" value="3544555.666">
    <input type="submit" value="😀XYZ->LBH" onclick="Start_XYZ_LBH()">
    <input type="submit" value="😀LBH->XYZ" onclick="Start_LBH_XYZ()">
    <input type="submit" value="😀---" onclick="test()">
  </form>
  <p id="demo">w0x7ce</p>
</html>

  x=1177888.777;
  y=5166777.888;
  z=3544555.666;
<br>
  L=77°11'22.333";
  B=33°44'55.666";
  H=5555.660;
{% endraw %}
