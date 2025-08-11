<?php
function breadcrumbs($home = 'Home') {
  global $page_title; //global varable that takes it's value from the page that breadcrubs will appear on. Can be deleted if you wish, but if you delete it, delete also the title tag inside the <li> tag inside the foreach loop.
    $breadcrumb  = '<div class="breadcrumbs mb-5" role="navigation"><ol class="list-group list-group-horizontal list-unstyled mb-2">';
    $root_domain = ($_SERVER['HTTPS'] ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'].'/';
    $breadcrumbs = array_filter(explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)));
    $breadcrumb .= '<li class="list-group-item"><a href="' . $root_domain . '" title="Home Page"><span>' . $home . '</span></a> <span class="bi bi-arrow-right"></span></li>';
    foreach ($breadcrumbs as $crumb) {
        $link = ucwords(str_replace(array(".php","-","_"), array(""," "," "), $crumb));
        $root_domain .=  $crumb;
        $breadcrumb .= '<li class="list-group-item"><a href="'. $root_domain .'" title="'.$link.'"><span>' . $link . '</span></a></li>';
    }
    $breadcrumb .= '</ol>';
    $breadcrumb .= '</div>';
    return $breadcrumb;
}
echo breadcrumbs();
?>