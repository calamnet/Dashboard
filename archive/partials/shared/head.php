<!doctype html>
<html lang="en-US">
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#">

<?php 
	// Google Analytics ID
	$GA_ID = "G-4JXSNVE7R7";
	// Set Default Metadata if not defined
	$meta_description_default = "Welcome";
	$meta_twitter_user = "@";
	// Set Default Body Class if not defined
	$bodyclass_default = "ContentPage";
	
	if (empty($content_desc) || !isset($content_desc)){
		$content_desc = $meta_description_default;
	}
	if (empty($bodyclass) || !isset($bodyclass)){
		$bodyclass = $bodyclass_default;
	}
?>
	
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta charset="utf-8" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <meta name="keywords" content="atomic acorn domains seo ssl templating marketing email" />
    <meta name="author" content="Atomic Acorn" />
    <meta name="description" content="Atomic Acorn is" />
    <meta name="referrer" content="unsafe-url" />
	
	<meta property="og:description" content="<?php echo $content_desc; ?>" />
    <meta property="og:url" content="https://atomicacorn.com" />
    <meta property="og:title" content="<?php echo $title; ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Atomic Acorn" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="<?php echo $meta_twitter_user; ?>" />	
	<meta name="twitter:description" content="<?php echo $content_desc; ?>" />
    <meta name="twitter:creator" content="<?php echo $meta_twitter_user; ?>" />
	
<title><?php echo $title; ?> | Atomic Acorn</title>

<link rel="icon" type="image/x-icon" href="images/favicon.ico" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap" rel="stylesheet">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<link href="css/screen.css" type="text/css" rel="stylesheet" media="all">

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4JXSNVE7R7"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '<?php echo $GA_ID; ?>');
</script>
</head>