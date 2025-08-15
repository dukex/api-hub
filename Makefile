bump-commit:
	git add package.json package-lock.json
	git commit -m "chore: bump version $(shell cat package.json | jq -r '.version')"

bump-minor:
	npm version --git-tag-version=false minor
	make bump-commit

git-release:
	git tag v$(shell cat package.json | jq -r '.version') -m "chore: release v$(shell cat package.json | jq -r '.version')"
	git push origin v$(shell cat package.json | jq -r '.version')
	git push origin main

docker-release: 
	docker buildx build --platform linux/amd64 -t dukex/api-hub:$(shell cat package.json | jq -r '.version') . 
	docker tag dukex/api-hub:$(shell cat package.json | jq -r '.version') docker.io/dukex/api-hub:$(shell cat package.json | jq -r '.version')
	docker push docker.io/dukex/api-hub:$(shell cat package.json | jq -r '.version')
	docker tag dukex/api-hub:$(shell cat package.json | jq -r '.version') docker.io/dukex/api-hub:latest
	docker push docker.io/dukex/api-hub:latest