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

class GUI {
	constructor() {
		this.file = null;

		this.propertiesVars =
			{
				"Scene": "Cubes",
				"Visual Elements": 128,
				"Audio Sensitivity": 2048,
				"Reset": () => { this.reset() }
			};

		this.audioOptionVars =
			{
				"Load": () => { this.load() },
				"Play": () => { this.play() },
				"Stop": () => { this.stop() }
			};

		var internalGUI = new dat.GUI();

		var properties = internalGUI.addFolder("Properties");
		properties.add(this.propertiesVars, "Scene", ["Cubes"]);
		properties.add(this.propertiesVars, "Visual Elements", [16, 32, 64, 128, 256]);
		properties.add(this.propertiesVars, "Audio Sensitivity", [512, 1024, 2048, 4096, 8192, 16384]);
		properties.add(this.propertiesVars, "Reset");
		properties.__controllers[1].onChange((value) => {
			COUNT = value;
			SIZE = (CONTAINER_LENGTH) / COUNT;
		});

		properties.__controllers[2].onChange((value) => {
			scriptProcessorCount = value;
		});

		var audioOptions = internalGUI.addFolder("Audio Options");
		audioOptions.add(this.audioOptionVars, "Load");
		audioOptions.add(this.audioOptionVars, "Play");
		audioOptions.add(this.audioOptionVars, "Stop");

		properties.open();
		audioOptions.open();
	}

	load() {
		var audioForm = document.getElementById("audio-form");

		if (audioForm) {
			document.getElementById("input-submit").removeEventListener("onclick");
			document.getElementById("input-cancel").removeEventListener("onclick");
			document.body.removeChild(audioForm);
		}
		else {
			audioForm = document.createElement("form");
			audioForm.id = "audio-form";

			var inputFile = document.createElement("input");
			inputFile.id = "input-file";
			inputFile.setAttribute("type", "file");
			inputFile.setAttribute("name", "file");

			var inputSubmit = document.createElement("button");
			inputSubmit.id = "input-submit";
			inputSubmit.setAttribute("type", "button");
			inputSubmit.textContent = "Submit";

			var inputCancel = document.createElement("button");
			inputCancel.id = "input-cancel";
			inputCancel.setAttribute("type", "button");
			inputCancel.textContent = "Cancel";

			audioForm.appendChild(inputFile);
			audioForm.appendChild(inputSubmit);
			audioForm.appendChild(inputCancel);
			document.body.appendChild(audioForm);

			inputSubmit.addEventListener("click", (event) => {
				event.stopPropagation();
			});

			inputSubmit.addEventListener("click", () => {
				var input = document.getElementById("input-file");
				var reader = new FileReader();

				reader.onload = () => {
					this.file = reader.result;

					document.getElementById("input-submit").removeEventListener("onclick", () => { });

					var audioForm = document.getElementById("audio-form");
					document.body.removeChild(audioForm);
				};

				reader.readAsArrayBuffer(input.files[0]);
			});

			inputCancel.addEventListener("click", (event) => {
				document.getElementById("input-submit").removeEventListener("onclick");
				document.getElementById("input-cancel").removeEventListener("onclick");
				document.body.removeChild(audioForm);
			});
		}
	}

	play(evt) {
		if (this.file == null) {
			alert("Please Load an audio file");
			evt.stopPropagation();
		}

		processor.process(
			this.file,
			this.propertiesVars["Audio Sensitivity"],
			createLoadingBanner,
			removeLoadingBanner);

		this.reset();
	}

	stop() {
		processor.stop();
	}

	reset() {
		document.body.removeChild(renderer.domElement);
		Clear();
		CreateScene();
		RenderTheme();
		render();
	}
}

function createLoadingBanner() {
	var banner = document.createElement("div");
	banner.id = "banner-container";

	var bannerText = document.createElement("span");
	bannerText.id = "banner-text";
	bannerText.textContent = "Loading...";

	banner.appendChild(bannerText);
	document.body.appendChild(banner);
}

function removeLoadingBanner() {
	document.body.removeChild(document.getElementById("banner-container"));
}