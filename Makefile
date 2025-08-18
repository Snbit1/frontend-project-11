.PHONY: lint lint-fix format

lint:
	npx eslint . --ext .js,.mjs,.cjs

lint-fix:
	npx eslint . --ext .js,.mjs,.cjs --fix

format:
	npx prettier --write .