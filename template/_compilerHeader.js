(function(modules) {
	var installedModules = {};
	function __jinx_require__(moduleId) {
		if(installedModules[moduleId]) return installedModules[moduleId].exports;
		var module = installedModules[moduleId] = {
			exports: {},
			id: moduleId,
			loaded: false
		};
		modules[moduleId].call(module.exports, module, module.exports, __jinx_require__);
		module.loaded = true;
		return module.exports;
	}
	return __jinx_require__(0);
})
