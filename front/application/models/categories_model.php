<?php

class Categories_model extends CI_Model {

	private $ENDPOINT = 'https://api.foursquare.com/v2';

	private function add_category($id, $name)
	{
		$this->load->database();

		$data = array(
			'4sq_id' => $id,
			'name' => $name
		);

		$this->db->insert('categories', $data);
	}

	private function parse_categories($data)
	{
		foreach ($data as $item)
		{
			if (!empty($item['categories']))
				$this->parse_categories($item['categories']);

			$this->add_category($item['id'], $item['name']);
		}
	}

	private function get_noise_words()
	{
		return array('i', 'want', 'to', 'get', 'go', 'the', 'a');
	}

   function cache_categories() 
   {
		$this->load->driver('cache', array('adapter' => 'file'));
		if (!$cached = $this->cache->get('categories'))
		{
			$this->load->library('curl');
			$url = $this->ENDPOINT . '/venues/categories?oauth_token=ZN1EU0HVWFSKKSEAOYI4OZ3VWKZISEOA5U2TLBAIGJYIXLLB&v=20120721';

			$data = $this->curl->simple_get($url);
			$data = json_decode($data, TRUE);

			$this->load->database();
			$this->db->empty_table('categories');

			$this->parse_categories($data['response']['categories']);
			$this->cache->save('categories', true, 3600); // 1 hour
		}

		return;
   }

   function search_categories($input)
   {
   	$this->load->database();

   	$input = strtolower($input);
   	$split = explode(" ", $input);

   	$split = array_diff($split, $this->get_noise_words());

   	$return = array();
   	foreach ($split as $word)
   	{
   		$this->db->from('categories')
   			->like('name', $word);

   		$query = $this->db->get();
   		$results = $query->result_array();

   		// if (count($results) < 3)
   		$return = array_merge($return, $results);
   	}

   	return $return;

   	// $query = $this->db->get();

   	// $sql = "SELECT * FROM categories WHERE MATCH (name) AGAINST ('%') > 0";
   	// $query = $this->db->query($sql, array($input));

   	// if ($query->num_rows() > 0)
   	// 	return $query->result_array();

   	// return array();
   }
}