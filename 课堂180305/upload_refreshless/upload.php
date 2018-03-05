<?php
//获取文件扩展名
function getExt($fileName){
	$pathInfo = pathinfo($fileName);
	return strtolower($pathInfo['extension']);
}
//定义允许的文件类型
$fileScope = array('jpg','jpeg','png','gif');
//定义最大允许上传的文件大小
$maxFileSize = 2*1024*1024;
$name = $_FILES['fileToUpload']['name'];
$ext = getExt($name);
if(empty($_FILES['fileToUpload'])){
	$res['code'] = 1004;
	$res["msg"] = "上传错误";
}elseif($_FILES['fileToUpload']['error']){
	$res['code'] = 1003;
	$res["msg"] = "上传错误";
}elseif(!in_array($ext,$fileScope)){
	$res['code'] = 1002;
	$res["msg"] = "文件类型不符合要求";
}elseif($_FILES['fileToUpload']['size']>=$maxFileSize){
	$res['code'] = 1001;
	$res["msg"] = "文件太大";
}else{
	$newName = uniqid().'.'.getExt($name);
	if(move_uploaded_file($_FILES['fileToUpload']['tmp_name'],"./upload/".$newName)){
		$res['code'] = 1000;
		$res["msg"] = "ok";
		$res['img'] = "./upload/".$newName;
		$res['fileName'] = $newName;
	}else{
		$res["code"] = 1005;
		$res["msg"] = "上传错误";
	}
}
echo json_encode($res);
?>