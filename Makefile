.PHONY: build
build:
	git archive -o 'build.zip' 'HEAD:src'

.PHONY: dev-build
dev-build:
	cd 'src' && zip -FSr '../dev-build.zip' .

.PHONY: webext
webext:
	web-ext run -s 'src/'

.PHONY: clean
clean:
	rm -f 'build.zip' 'dev-build.zip'
