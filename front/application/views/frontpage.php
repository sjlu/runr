<div id="header">
	<img src="<?= base_url('assets/img/header.png') ?>" />
</div>

<div class="section" id="location">
	<div class="title">
		<i class="icon-map-marker"></i>
		<span>Detecting current location...</span>
	</div>
</div>

<div class="section" id="tasks">
	<div class="title">
		<i class="icon-check"></i>
		<span>Things I've got to do:</span>
	</div>
	<input type="text" id="input" disabled="disabled"/>
	<div id="items">
		<ul></ul>
	</div>
	<div id="button">Submit</div>
</div>


<div id="results">
	<div id="places">
		<div id="places-container">
			<h1><i class="icon-sitemap"></i>Results</h1>
			<ul></ul>
		</div>
		<a id="refine">refine list</a>
	</div>
	<div id="map"></div>
</div>