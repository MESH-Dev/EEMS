<?php
$DB_HOST = 'eemswp.db.6117951.hostedresource.com';
$DB_USER = 'eemswp';
$DB_PASS = 'eemsWV13!';
$DB_NAME = 'eemswp';
$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

header('Content-Type: application/json');

include('wp-load.php');

$arr = array();

$args = array(
  'post_type' => 'business',
  'posts_per_page'=> -1,
  'orderby' => 'title',
  'order' => 'asc'
);

query_posts( $args );

while (have_posts()) { the_post();

  $terms = wp_get_post_terms($post->ID, 'businesstype');
  $locs = wp_get_post_terms($post->ID, 'location');

  $title = get_the_title();
  $address = get_field('address');
  $city = get_field('city');
  $phone = get_field('phone');
  $website = get_field('website');

  $facebook = get_field('facebook');
  $twitter = get_field('twitter');

  $content = get_the_content();

  $a = [
    "terms" => $terms,
    "locs" => $locs,
    "title" => $title,
    "address" => $address,
    "city" => $city,
    "phone" => $phone,
    "website" => $website,
    "facebook" => $facebook,
    "twitter" => $twitter,
    "content" => $content
  ];

  array_push($arr, $a);

}

# JSON-encode the response
$json = json_encode($arr, JSON_PRETTY_PRINT);

$myfile = fopen("businesses.json", "w") or die("Unable to open file!");
fwrite($myfile, $json);
fclose($myfile);

?>
