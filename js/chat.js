export function fetchDeepSeekStream(messages, onProgress, onComplete, onError, onAbort) {
	const API_URL = 'https://api.deepseek.com/v1/chat/completions';
	const API_KEY = ''; // 你的 API Key
 
	let isStopped = false;
	let typedResult = '';
 
	const requestData = {
		model: "deepseek-chat",
		messages: messages.slice(-10), // 只保留最近10条 
		stream: true,
	};
 
	// #ifdef H5
	const controller = new AbortController(); //AbortController 接口表示一个控制器对象，允许你根据需要中止一个或多个 Web 请求。
	// fetch文档  https://developer.mozilla.org/zh-CN/docs/Web/API/Window/fetch
	fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${API_KEY}`
		},
		body: JSON.stringify(requestData),
		signal: controller.signal
	}).then(async response => {
		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");
		let partialData = "";
 
		async function readStream() {
			try {
				const { done, value } = await reader.read();
				if (done || isStopped) {
					onComplete && onComplete(typedResult);
					return;
				}
 
				const text = decoder.decode(value, { stream: true });
				partialData += text;
 
				const lines = partialData.split("\n");
				partialData = lines.pop(); // 可能存在未完整的 JSON 片段
 
				for (const line of lines) {
					// 数据格式 data: {"id":"6b164fc4-5111-4267-a094-3d36edf3200d","object":"chat.completion.chunk","created":1741932057,"model":"deepseek-chat","system_fingerprint":"fp_3a5770e1b4_prod0225","choices":[{"index":0,"delta":{"content":"你在"},"logprobs":null,"finish_reason":null}]}
					if (line.trim().startsWith("data: ")) {
						const jsonStr = line.replace("data: ", "").trim(); // 去掉 "data: "
						if (jsonStr === "[DONE]") {
							onComplete && onComplete(typedResult);
							return;
						}
 
						try {
							const jsonData = JSON.parse(jsonStr);
							const content = jsonData.choices?.[0]?.delta?.content || ""; // DeepSeek SSE 增量更新
							for (let i = 0; i < content.length; i++) {
								if (isStopped) return;
								typedResult += content[i];
								await new Promise((res) => setTimeout(res, 30));
								onProgress && onProgress(typedResult);
							}
						} catch (e) {
							console.error("JSON 解析失败", e);
						}
					}
				}
				readStream();
			} catch (error) {
				console.error("读取流数据失败", error);
				onError && onError(error);
			}
		}
 
		readStream();
	}).catch(error => {
		console.error("请求失败", error);
		onError && onError(error);
	});
	// #endif 
 
	// #ifdef MP-WEIXIN
	// 文档 https://uniapp.dcloud.net.cn/api/request/request.html
	const requestTask = uni.request({
		url: API_URL,
		enableChunked: true, //开启 transfer-encoding chunked
		responseType: 'arraybuffer', //设置响应的数据类型。合法值：text、arraybuffer
		method: "POST",
		header: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${API_KEY}`
		},
		data: requestData,
		success: (res) => {
			console.log("请求完成", res);
		},
		fail: (err) => {
			onError(err);
		}
	});
 
	let accumulatedText = ""; // 存储未处理的流数据
	let fullMessage = ""; // 存储最终拼接的消息
 
	requestTask.onChunkReceived(async (res) => {
		const uint8Array = new Uint8Array(res.data);
		// 兼容 TextDecoder 的 UTF-8 解码  微信小程序不支持 const decoder = new TextDecoder("utf-8"); 
		function decodeUTF8(arr) {
			return decodeURIComponent(arr.map(byte => `%${byte.toString(16).padStart(2, "0")}`).join(""));
		}
		// 进行解码
		const chunkText = decodeUTF8([...uint8Array]);
 
		// 累积数据
		accumulatedText += chunkText;
 
		// 处理多行 JSON 片段
		const lines = accumulatedText.split("\n");
		accumulatedText = ""; // **暂时清空，后续可能补回**
 
		for (let line of lines) {
			if (line === "data: [DONE]") {
				onComplete && onComplete(fullMessage); // **这里 fullMessage 是完整的内容**
				return; // **提前结束，不再解析后续数据**
			}
 
			// 去掉 `data: ` 前缀
			if (line.startsWith("data: ")) {
				line = line.replace("data: ", "");
			}
 
			try {
				const parsedData = JSON.parse(line);
				const content = parsedData.choices?.[0]?.delta?.content || "";
				fullMessage += content; // 累积返回的文本
 
				//  确保每次解析到新内容时，都执行 onProgress
				onProgress && onProgress(fullMessage);
			} catch (error) {
				// JSON 解析失败，可能是数据未完全接收，等待下一个 chunk
				accumulatedText += line + "\n"; // **补回未解析的部分**
			}
		}
	});
 
	// #endif
 
	// 返回 `stop` 方法，外部可以调用 `stopStream()` 终止请求
	return () => {
		console.log('中断请求...');
		isStopped = true;
 
		// #ifdef H5 
		controller.abort();
		// #endif
 
		// #ifdef MP-WEIXIN
		requestTask.abort();
		// #endif 
 
		onAbort && onAbort();
	};
}