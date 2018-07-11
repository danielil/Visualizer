/**
 * The MIT License (MIT)
 * Copyright (c) 2015-2018 Daniel Sebastian Iliescu, http://dansil.net
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var	file;
var elements = [];
var source;

function MakeAudioRequest()
{
	var context = new AudioContext();
	var request = new XMLHttpRequest();
	request.open('GET', file, true);
	request.responseType = "arraybuffer";

	CreateLoadingBanner("Loading...");

	request.onload = function()
	{
		if (request.readyState === 4 && request.status === 200)
		{
			document.body.removeChild(document.getElementById("banner-container"));

			context.decodeAudioData(
				request.response,
				function(buffer)
				{
					var scriptProcessor = context.createScriptProcessor(propertiesVars["Audio Sensitivity"]);
					scriptProcessor.buffer = buffer;
					scriptProcessor.connect(context.destination);

					var analyser = context.createAnalyser();
					analyser.smoothingTimeConstant = 0.6;
					analyser.fftSize = 2048;

					source = context.createBufferSource();
					source.buffer = buffer;

					source.connect(analyser);
					analyser.connect(scriptProcessor);
					source.connect(context.destination);

					scriptProcessor.onaudioprocess = function(e)
					{
						elements = new Uint8Array(analyser.frequencyBinCount);
						analyser.getByteFrequencyData(elements);
					};

					source.start(0);
				},

				function(error)
				{
					console.log("Error decoding audio file: " + error)
				}
			);
		}
	};

	request.onerror = function()
	{
		console.log("Error with XHR request.");
	};

	request.send();
}

function CreateLoadingBanner(text)
{
	var banner = document.createElement("div");
	banner.id = "banner-container";

	var bannerText = document.createElement("span");
	bannerText.id = "banner-text";
	bannerText.textContent = text;

	banner.appendChild(bannerText);
	document.body.appendChild(banner);
}