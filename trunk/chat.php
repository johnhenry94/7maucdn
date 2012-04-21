<?php
/*$id=0;

 $sql = 'SELECT * FROM `gomoku`.`turns` WHERE id>:id LIMIT 1';
 $query = $pdo->prepare($sql);
 $query->bindParam(":id", $id);
    
 foreach ($query->fetchAll() as $row) {
      print $row['id'] . '<br />';
 }

*/

function mk_json(){
    
    
    
}

$pdo = new PDO('mysql:host=localhost;dbname=gomoku','gomoku','JKjkhsdjhJH');

if(isset($_GET['msg'])){
    
    $sql = 'INSERT INTO `chat` (`msg`)VALUES (:msg);';
    $query = $pdo->prepare($sql);
    $query->bindParam(":msg", $_GET['msg']);
    $query->execute();
    die;
}

$time=time();

if(isset($_GET['id']) && ((int)$_GET['id'])>0){
   
    while(1){
   
       $id = (int)$_GET['id'];
       $sql = 'SELECT * FROM `chat` WHERE `id`>='.$id;
     
       $msg = array();
       
       foreach ($pdo->query($sql) as $row) 
           $msg[] = array($row['id'], $row['msg']);
       
       if(isset($msg[0])) {
           echo json_encode($msg);
           die;    
       }
       
       if(time()-$time>28){echo  json_encode(array());die;};
       
       sleep(1);
    
       
    }
    
}
