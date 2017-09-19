PROJECTNAME = member-info-bot
HOMEDIR = $(shell pwd)
USER = bot
SERVER = smidgeo
SSHCMD = ssh $(USER)@$(SERVER)
APPDIR = /opt/$(PROJECTNAME)

pushall: sync
	git push origin master

sync:
	rsync -a $(HOMEDIR) $(USER)@$(SERVER):/opt --exclude node_modules/ --exclude raw-data
	$(SSHCMD) "cd $(APPDIR) && npm install"

test:
	node tests/get-member-fact-tests.js

clean-up-artists:
	rm -f data/popular-artists-without-first-names.json
	node tools/strip-out-names-with-first-names.js raw-data/popular-artists.json > data/popular-artists-without-first-names.json
