<?php

class security {
	
	private $local_ipv4 = null;
	private $ip_accept_list = [];
	private $host_launch_ip = null;
	private $api_launch_ip = null;
	private $local_host = null;
	
	function __construct() {
		$server_data = app('server')->getServerData();
		$this->local_ipv4 = $server_data->ipv4;
		$this->local_host = app('server')->local_host;
		$this->requestIPAcceptList();
		$this->host_launch_ip = $server_data->host_launch_ip;
		$this->api_launch_ip = $server_data->api_ip;
	}
	
	function saveIPAcceptList() {
		// treat list as executable that cannot be accessed from outside of this class
		file_put_contents(getBasePath().'/apps/app_data/ip_accept_list.php', '<?php exit; ?>'.json_encode($this->ip_accept_list));
	}
	
	function requestIPAcceptList() {
		if (!file_exists(getBasePath().'/apps/app_data/ip_accept_list.php')) {
			$this->saveIPAcceptList();
		}
		// strip exit and decide trailing json
		$this->ip_accept_list = json_decode(str_replace('<?php exit; ?>', '', file_get_contents(getBasePath().'/apps/app_data/ip_accept_list.php')));
	}
	
	function isLocalMachine() {
		return $this->host_launch_ip == $this->local_host && in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) || $this->host_launch_ip != $this->local_host && $this->host_launch_ip == $_SERVER['REMOTE_ADDR'];
	}
	
	function isAcceptedIP($ip) {
		// machine ipv4 or in accepted list
		return $_SERVER['REMOTE_ADDR'] == $this->local_ipv4 || $_SERVER['REMOTE_ADDR'] == $this->api_launch_ip || in_array($_SERVER['REMOTE_ADDR'], $this->ip_accept_list);
	}
	
	function test() {
		
		// if local cli or if local machine or whitelisted ip
		if (php_sapi_name() === 'cli' || $this->isLocalMachine() || $this->isAcceptedIP($_SERVER['REMOTE_ADDR'])) {
			return true;
		}
		
		// failed ip check, look for authorized scripts or specific error declarations
		$access_url = parse_url($_SERVER['REQUEST_URI']);
		
		// allow access to api_connection_library.js.php and fonts.php library
		if (in_array($access_url['path'], ['/api/api_connection_library.js.php', '/api_connection_library.js.php', '/api/fonts', '/fonts']) && str_contains(getcwd(), (app('server')->OS == 'Windows' ? 'FSDStudio\api' : 'FSDStudio/api'))) {
			return true;
		}
		
		// if worker auth connection, instead declare an undefined variable
		if ($access_url['path'] == '/worker_auth_connection_key.js.php') {
			echo 'const API_WORKER_AUTH_TOKEN = undefined;';
			exit;
		}
		
		// unauthorized access to external application
		echo '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="font-family:arial;"><div style="text-align:center;"><h1>Unauthorized</h1><p>If this is a mistake, please whitelist the following IP from the servers local application: <h3>'.$_SERVER['REMOTE_ADDR'].'</h3></p></div></body></html>';
		exit;
	}
	
	function requestAcceptsIPs() {
		return $this->ip_accept_list;
	}
	
	function updateIPs($ips) {
		// accept only value ipv4 addresses
		$this->ip_accept_list = array_filter($ips, function ($ip) {
			return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4);
		});
		$this->saveIPAcceptList();
	}
	
}

?>