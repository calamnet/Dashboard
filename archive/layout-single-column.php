<?php include "partials/shared/head.php";?>

<body class="<?php echo $bodyclass ?>">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>

<?php include "partials/shared/header.php";?>

<main id="AcornMain" role="main">
	<div class="container">
		<div class="row">
			<div class="col-12 p-0">
				<?php include "partials/shared/carousel.php";?>
			</div>	
		</div>
		<div class="row">
				<div class="col-12 col-sm-10 offset-sm-1 py-5">
					<h1 class="page-header"><?php echo $title ?></h1>
					<?php include "partials/shared/breadcrumbs.php";?>
					<?php include($content); ?>
				</div>
		</div>
	</div>
</main>

<?php include "partials/shared/socials.php";?>

<?php include "partials/shared/footer.php";?>

<!-- Start of atomicacorn Zendesk Widget script -->
<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=96c85081-1318-46ab-8a40-d0d85cedf74b"> </script>
<!-- End of atomicacorn Zendesk Widget script -->
</body>
</html>