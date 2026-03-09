# Milo federalised content

This project exists as a home for centralised content for milo projects. https://github.com/orgs/adobecom/discussions/1388

## Submodules

This project uses submodules. You may want to do

```bash
git submodule update --init --recursive
```

If you're cloning for the first time, you can skip the above step by doing

```bash
git clone --recurse-submodules https://github.com/adobecom/federal
```

To get the latest code in the submodule do:

```bash
git submodule update --remote
```

(cd into the directory and `git fetch && git merge` will work too)

For more information see: https://git-scm.com/book/en/v2/Git-Tools-Submodules


