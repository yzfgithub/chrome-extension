##  如果需要主动开启 则配置如下： 

```
manifest.json:

	"content_scripts": [
		{
			"matches": ["https://blog.csdn.net/*","https://www.zhihu.com/*"],
			"js": ["content_script.js"],
			"run_at": "document_idle"
		}
	]
	"browser_action": {
		"default_icon": "su.png",
		"default_title": "csdn复制加载",
		"default_popup": "expand.html"
	},
	"browser_action": {
		"default_icon": "su.png",
		"default_title": "csdn复制加载",
		"default_popup": "expand.html"
	}
```
### chrome插件通信
```
expand.html
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>expand</title>
		<link rel="stylesheet" href="./style.css">
	</head>
	<body>
		允许复制与加载更多：<input type="checkbox" class="switch" id="toggle" />
		<script src='expand.js'></script>
	</body>
	</html>

style.css
	body {
	  width: 160px;
	  height: 24px;
	  background-color: lavender;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}

	/* Switch开关样式 */
	input[type='checkbox'].switch {
	  outline: none;
	  appearance: none;
	  -webkit-appearance: none;
	  -moz-appearance: none;
	  position: relative;
	  width: 40px;
	  height: 20px;
	  background: #ccc;
	  border-radius: 10px;
	  transition: border-color 0.3s, background-color 0.3s;
	}

	input[type='checkbox'].switch::after {
	  content: '';
	  display: inline-block;
	  width: 1rem;
	  height: 1rem;
	  border-radius: 50%;
	  background: #fff;
	  box-shadow: 0, 0, 2px, #999;
	  transition: 0.4s;
	  top: 2px;
	  position: absolute;
	  left: 2px;
	}

	input[type='checkbox'].switch:checked {
	  background: rgb(19, 206, 102);
	}

	/* 当input[type=checkbox]被选中时：伪元素显示下面样式 位置发生变化 */
	input[type='checkbox'].switch:checked::after {
	  content: '';
	  position: absolute;
	  left: 55%;
	  top: 2px;
	}

expand.js
	// 这里的js其实是操作popup.html产生的dom的
	document.addEventListener('DOMContentLoaded', function () {
	  // 获取开关按钮的初始值。这里{ type: 'get_editable' }是可以随意定义的，可以传递任何你想传递的信息
	  sendMessageToContentScript({ type: 'get_editable' }, (response) => {
	    toggle.checked = ['true', true].includes(response) ? 'checked' : null;
	  });

	  // 切换contentEditable状态
	  toggle.addEventListener('change', () => {
	    sendMessageToContentScript({ type: 'toggle' });
	  });
	});

	// 向content_scripts发送消息的函数
	function sendMessageToContentScript(message, callback) {
	  // 这里用到了tabs，所以前面配置文件需要配置"permissions": ["tabs"]
	  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
	      if (callback) callback(response);
	    });
	  });
	}

content_script.js
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	  // 数据处理和返回。是不是有点类似redux中reducer数据处理的感觉
	  switch (request.type) {
	    case 'get_editable':
	      // 将当前文档是否可编辑的信息返回给popup，控制开关的形态
	      sendResponse(document.body.contentEditable);
	      break;
	    case 'toggle':
	    	console.log('change', document.body.contentEditable === 'true' ? false : true)
	    	document.body.contentEditable = true;
	    	var expandList = document.getElementsByClassName('look-more-preCode');
	    	for(var i = expandList.length -1; i>=0 ; i--) {
	    		(function(j){
	    			console.log(j,'j');
	    			expandList[j].click();
	    		})(i)
	    	}
	    	var contentDom = document.getElementById("article_content");
	    	contentDom.style.height="auto"
	    	var hideDom = document.getElementsByClassName('hide-article-box');
	    	if(hideDom.length) {
	    		hideDom[0].style.display="none"
	    	}
	    default:
	      break;
	  }
	});



```