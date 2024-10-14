<?php
    //headers 
    header('Acess-Control-Allow-Orogin: *');
    header('Content-Type: application/json');

    //initializing our api
    include_once('../core/initialize.php');

    //instantiate post
    $post = new Post($db);

    //blog post query 
    $result = $post->read();

    //get the row counr 
    $num = $result->rowCount();

    if ($num > 0){
        $post_arr['data'] = array();

        while($row = $result->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $post_item = array(
                'id' => $id,
                'title' => $title,
                'body' => html_entity_decode($body),
                'author' => $category_id,
                'category_name' => $category_name
            );
            array_push($post_arr['data'], $post_item);
        }

        //convert to JSON and output
        echo json_encode($post_arr);
    }
    else{
        echo json_encode(array('message' => 'no posts found.'));
    }
?>