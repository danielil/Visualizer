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

class AudioProcessor {
	constructor() {
		this.__elements = [];
		this.__source = null;

		this.__smoothingTimeConstant = 0.6;
		this.__fastFourierTransformSize = 2048;
	}

	process(file, audioSensitivity, preLoadAction, postLoadAction) {
		preLoadAction();
		
		let context = new AudioContext();

		context.decodeAudioData(file).then(
			(buffer) => {
				let scriptProcessor = context.createScriptProcessor(audioSensitivity);
				scriptProcessor.buffer = buffer;
				scriptProcessor.connect(context.destination);

				let analyser = context.createAnalyser();
				analyser.smoothingTimeConstant = this.__smoothingTimeConstant;
				analyser.fftSize = this.__fastFourierTransformSize;

				this.__source = context.createBufferSource();
				this.__source.buffer = buffer;

				this.__source.connect(analyser);
				analyser.connect(scriptProcessor);
				this.__source.connect(context.destination);

				scriptProcessor.onaudioprocess = () => {
					this.__elements = new Uint8Array(analyser.frequencyBinCount);
					analyser.getByteFrequencyData(this.__elements);
				};

				this.__source.start();

				postLoadAction();
			},

			(error) => {
				console.log("Error decoding audio file: " + error)
			}
		);
	}

	start() {
		this.__source.start();
	}

	stop() {
		this.__source.stop();
	}

	get elements() {
		return this.__elements;
	}
}