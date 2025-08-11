<div class="alert alert-warning w-50 float-end ms-3 mb-3">
<p>Find out more details:</p>
<p><a href="https://domains.atomicacorn.com" class="btn btn-theme btn-theme-primary">Order now</a></p>
</div>

<h2>What is an SSL certificate?</h2>
					
<p>SSL certificates are what enable websites to use HTTPS, which is more secure than HTTP. An SSL certificate is a data file hosted in a website's origin server. SSL certificates make SSL/TLS encryption possible, and they contain the website's public key and the website's identity, along with related information.</p>

<p>Devices attempting to communicate with the origin server will reference this file to obtain the public key and verify the server's identity. The private key is kept secret and secure.</p>

<h2>What is SSL?</h2>

<p>SSL, more commonly called TLS, is a protocol for encrypting Internet traffic and verifying server identity. Any website with an HTTPS web address uses SSL/TLS.</p>

<h2>How do SSL certificates work?</h2>

<p>SSL certificates include the following information in a single data file:</p>

<ul>
	<li>The domain name that the certificate was issued for</li>
	<li>Which person, organization, or device it was issued to</li>
	<li>Which certificate authority issued it</li>
	<li>The certificate authority's digital signature</li>
	<li>Associated subdomains</li>
	<li>Issue date of the certificate</li>
	<li>Expiration date of the certificate</li>
	<li>The public key (the private key is kept secret)</li>
</ul>

<p>The public and private keys used for SSL are essentially long strings of characters used for encrypting and signing data. Data encrypted with the public key can only be decrypted with the private key.</p>

<p>The certificate is hosted on a website's origin server, and is sent to any devices that request to load the website. Most browsers enable users to view the SSL certificate: in Chrome, this can be done by clicking on the padlock icon on the left side of the URL bar.</p>

<h2>Why do websites need an SSL certificate?</h2>

<p>A website needs an SSL certificate in order to keep user data secure, verify ownership of the website, prevent attackers from creating a fake version of the site, and gain user trust.</p>

<p>Encryption: SSL/TLS encryption is possible because of the public-private key pairing that SSL certificates facilitate. Clients (such as web browsers) get the public key necessary to open a TLS connection from a server's SSL certificate.</p>

<p>Authentication: SSL certificates verify that a client is talking to the correct server that actually owns the domain. This helps prevent domain spoofing and other kinds of attacks.</p>

<p>HTTPS: Most crucially for businesses, an SSL certificate is necessary for an HTTPS web address. HTTPS is the secure form of HTTP, and HTTPS websites are websites that have their traffic encrypted by SSL/TLS.</p>

<p>In addition to securing user data in transit, HTTPS makes sites more trustworthy from a user's perspective. Many users won't notice the difference between an http:// and an https:// web address, but most browsers tag HTTP sites as "not secure" in noticeable ways, attempting to provide incentive for switching to HTTPS and increasing security.</p>

<h2>How does a website obtain an SSL certificate?</h2>

<p>For an SSL certificate to be valid, domains need to obtain it from a certificate authority (CA). A CA is an outside organization, a trusted third party, that generates and gives out SSL certificates. The CA will also digitally sign the certificate with their own private key, allowing client devices to verify it. Most, but not all, CAs will charge a fee for issuing an SSL certificate.</p>

<p>Once the certificate is issued, it needs to be installed and activated on the website's origin server. Web hosting services can usually handle this for website operators. Once it's activated on the origin server, the website will be able to load over HTTPS and all traffic to and from the website will be encrypted and secure.</p>

<h2>What is a self-signed SSL certificate?</h2>

<p>Technically, anyone can create their own SSL certificate by generating a public-private key pairing and including all the information mentioned above. Such certificates are called self-signed certificates because the digital signature used, instead of being from a CA, would be the website's own private key.</p>

<p>But with self-signed certificates, there's no outside authority to verify that the origin server is who it claims to be. Browsers don't consider self-signed certificates trustworthy and may still mark sites with one as "not secure," despite the https:// URL. They may also terminate the connection altogether, blocking the website from loading.</p>