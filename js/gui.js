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

var propertiesVars;
var audioOptionVars;
var active;

/**
 * Creates the dat.GUI interface with the global object containers.
 */
function CreateGUI()
{
	propertiesVars =
	{
		"Scene": "Cubes",
		"Visual Elements": 128,
		"Audio Sensitivity": 2048,
		"Reset": Reset
	};

	audioOptionVars =
	{
		"Load": LoadAudio,
		"Play": PlayAudio,
		"Stop": StopAudio
	};

	var gui = new dat.GUI();

	var properties = gui.addFolder("Properties");
	properties.add(propertiesVars, "Scene", ["Cubes"]);
	properties.add(propertiesVars, "Visual Elements", [16, 32, 64, 128, 256]);
	properties.add(propertiesVars, "Audio Sensitivity", [512, 1024, 2048, 4096, 8192, 16384]);
	properties.add(propertiesVars, "Reset");
	properties.__controllers[1].onChange(function(value)
	{
		COUNT = value;
		SIZE = (CONTAINER_LENGTH ) / COUNT;
	});

	properties.__controllers[2].onChange(function(value)
	{
		scriptProcessorCount = value;
	});

	var audioOptions = gui.addFolder("Audio Options");
	audioOptions.add(audioOptionVars, "Load");
	audioOptions.add(audioOptionVars, "Play");
	audioOptions.add(audioOptionVars, "Stop");

	properties.open();
	audioOptions.open();
}

/*
 * Loads the audio and parse it and then stores the frequency data into an array.
 */
function LoadAudio()
{
	var audioForm = document.getElementById("audio-form");

	if (audioForm)
	{
		document.getElementById("input-submit").removeEventListener("onclick");
		document.getElementById("input-cancel").removeEventListener("onclick");
		document.body.removeChild(audioForm);
	}
	else
	{
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

		inputSubmit.addEventListener("click", function(event)
								   {
			event.stopPropagation();
			ReadFile();
		});

		inputCancel.addEventListener("click", function(event)
		{
			document.getElementById("input-submit").removeEventListener("onclick");
			document.getElementById("input-cancel").removeEventListener("onclick");
			document.body.removeChild(audioForm);
		});
	}

}
/*
 * Reads the audio file using given by the system filesystem.
 */
function ReadFile()
{
	if (active)
	{
		active = false;

		source.stop();
	}

	var input = document.getElementById("input-file");
	var reader = new FileReader();

	reader.onload = function()
	{
		file = reader.result;

		fileName = input.files[0].name;

		document.getElementById("input-submit").removeEventListener("onclick", function(){});

		var audioForm = document.getElementById("audio-form");
		document.body.removeChild(audioForm);
	};

	reader.readAsDataURL(input.files[0]);
}

/*
 * Play and stop the file.
 */
function PlayAudio(evt)
{

	if(file == null)
	{
		alert("Please Load an audio file");
		evt.stopPropagation();
	}

	if (active)
	{
		active = false;
		source.stop();
	}
	else
	{
		active = true;
		MakeAudioRequest();
		Reset();
	}
}

/*
 * Resets member data ; used when switching scene as well as for manual reset when changing variables.
 */
function Reset()
{
	document.body.removeChild( renderer.domElement );
	Clear();
	CreateScene();
	RenderTheme();
	render();
}

/*
 * Stops the file playback.
 */
function StopAudio()
{
	if (active)
	{
		active = false;
		source.stop();
	}
}