<?php

$x = $_GET['x'];
$y = $_GET['y'];

$pdo = new PDO('mysql:host=localhost;dbname=gomoku','gomoku','JKjkhsdjhJH');

$sql = 'INSERT INTO `turns` (`x`,`y`,`type`)VALUES (:x,:y,:type);';
$query = $pdo->prepare($sql);
$query->bindParam(":x", $x);
$query->bindParam(":y", $y);
$type=1;
$query->bindParam(":type", $type);
$query->execute();


