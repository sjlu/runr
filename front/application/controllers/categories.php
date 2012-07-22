<?php
require(APPPATH.'libraries/REST_Controller.php'); 

class Categories extends REST_Controller {

	function index_get()
	{
		$search = $this->get('search');

		$this->load->model('categories_model');
		$this->categories_model->cache_categories();
		$categories = $this->categories_model->search_categories($search);

		$this->response($categories);
	}

}