<?php

$x = $_GET['x'];
$y = $_GET['y'];

$pdo = new PDO('mysql:host=localhost;dbname=gomoku','gomoku','JKjkhsdjhJH');

$sql = 'SELECT `lastType` FROM `games` WHERE `id`=1 LIMIT 1';


foreach ($pdo->query($sql) as $row) ;

$type=($row[0][0]-1)*(-1);

$sql = 'UPDATE `games` SET `lastType`='.$type.' WHERE `id`=1 LIMIT 1';

$pdo->query($sql);


$sql = 'INSERT INTO `turns` (`x`,`y`,`type`)VALUES (:x,:y,:type);';
$query = $pdo->prepare($sql);
$query->bindParam(":x", $x);
$query->bindParam(":y", $y);
$query->bindParam(":type", $type);
$query->execute();


