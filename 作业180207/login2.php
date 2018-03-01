<?php 
header("Content-type:text/html;charset=utf-8");
if(!empty($_POST)){
	$username= $_POST['username'];
	$password= md5($_POST['password']);
	$link = mysqli_connect('localhost', 'root', 'Iamapig120', '0126');
	if (!$link) {
	    die('Connect Error (' . mysqli_connect_errno() . ') '
	            . mysqli_connect_error());
	}
	mysqli_query($link,'SET NAMES UTF8');
	//查询
	$sql='SELECT * FROM admin WHERE BINARY username="'.$username.'" AND BINARY password="'.$password.'"';
	//echo $sql;
	$res=mysqli_query($link,$sql) or die(mysqli_error($link));
	$list=array();
	$userInfo=mysqli_fetch_assoc($res);
	// while($data=mysqli_fetch_assoc($res)){
	// 	$list[]=$data;
	// }
	if(!empty($userInfo)){
		session_start();
		$_SESSION['username']=$username;
	    echo "success";
		//header('Location:index.php');
	}else{
		echo '<script>alert("用户名或密码错误!")</script>';
	}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<form action="" method="post">
		<input type="text" placeholder='用户名' name='username'>
		<input type="password" placeholder='密码' name='password'>
		<input type="submit">
	</form>
</body>
</html>