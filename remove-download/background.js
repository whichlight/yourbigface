// Chrome's downloads will be cleared out every 5 seconds.
var clearfreq = 30;
// The initialization routine is called only once.
onload = setTimeout(init,0);

	function init()
	{
		// Set the interval at which the downloads will be erased.
		setInterval(cleardownloads, clearfreq);
	};

	function cleardownloads()
	{
		// Debug message only. Remove for actual runtime.
		// alert ("About to remove Downloads");

		// Perform the clearing of the browsing data. (0 means everything.)
		chrome.browsingData.remove({"since": 0}, {"downloads": true});

		// Debug message only. Remove for actual runtime.
		// alert ("Downloads cleared!");
	};

