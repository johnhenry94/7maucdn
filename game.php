<?php

$pdo = new PDO('mysql:host=localhost;dbname=gomoku','gomoku','JKjkhsdjhJH');
$time=time();
while(1){
   
    $id = (int)$_GET['id'];
    $sql = 'SELECT * FROM `turns` WHERE `id`>='.$id;

    $msg = array();

    foreach ($pdo->query($sql) as $row) 
        $msg[] = array($row['id'], $row['x'], $row['y'], $row['type']);

    if(isset($msg[0])) {
        echo json_encode($msg);
        die;    
    }

    if(time()-$time>28){echo  json_encode(array());die;};

    sleep(1);


}

/*$id=0;
$pdo = new PDO('mysql:host=localhost;dbname=gomoku','gomoku','JKjkhsdjhJH');
 $sql = 'SELECT * FROM `gomoku`.`turns` WHERE id>:id LIMIT 1';
 $query = $pdo->prepare($sql);
 $query->bindParam(":id", $id);
    
 foreach ($query->fetchAll() as $row) {
      print $row['id'] . '<br />';
 }



if(isset($_GET['new'])){
    
    //TODO Сделать проверку,ч то эти значения есть
    $x = (int)$_GET['x'];
    $y = (int)$_GET['y'];
    $type = (int)$_GET['type'];
        
    $sql = 'INSERT INTO `gomoku`.`turns` (`x` ,`y` ,`type`)VALUES (":x", ":y", ":type");';
    $query = $pdo->prepare($sql);
    $query->bindParam(':x', $x);
    $query->bindParam(':y', $y);
    $query->bindParam(':type', $type);
    $query->execute();
    echo mysql_insert_id();
    die;         
}

//while(1){
    
    $id=$_GET['id'];
    $sql = 'SELECT * FROM `gomoku`.`turns` --WHERE id>:id LIMIT 1';
    
    $query = $pdo->prepare($sql);
    $query->bindParam(":id", $id);
    
    foreach ($query->execute() as $row) {
        print $row['id'] . '<br />';
        }
    
    
    
//}
  
 
 */