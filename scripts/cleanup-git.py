#!/usr/bin/env python3
import subprocess
import sys

def run_cmd(cmd):
    """Run a shell command and return output."""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip(), result.returncode

def get_worktrees_to_delete():
    """Get list of worktrees to delete."""
    output, _ = run_cmd("git worktree list")
    to_delete = []

    if not output:
        return to_delete

    lines = output.split("\n")
    for line in lines:
        if not line.strip():
            continue
        parts = line.split()
        path = parts[0]
        # Skip the primary worktree
        if ".claude/worktrees" not in path:
            continue
        to_delete.append(path)

    return to_delete

def get_branches_to_delete():
    """Get list of branches to delete."""
    # --format avoids the "* " / "+ " markers for checked-out branches
    output, _ = run_cmd("git branch --format='%(refname:short)'")
    if not output:
        return []

    branches = [b.strip() for b in output.split("\n") if b.strip()]
    keep = {"main", "development"}
    return [b for b in branches if b not in keep]

def confirm_cleanup(worktrees, branches):
    """Display items to be deleted and ask for confirmation."""
    print("=" * 60)
    print("GIT CLEANUP PREVIEW")
    print("=" * 60)

    if worktrees:
        print("\nWorktrees to delete:")
        for wt in worktrees:
            print(f"  - {wt}")
    else:
        print("\nNo worktrees to delete.")

    if branches:
        print("\nBranches to delete:")
        for branch in branches:
            print(f"  - {branch}")
    else:
        print("\nNo branches to delete.")

    print("\n" + "=" * 60)
    response = input("Proceed with cleanup? (y/n): ").strip().lower()
    return response == "y"

def delete_worktrees(worktrees):
    """Delete specified worktrees."""
    if not worktrees:
        return

    for path in worktrees:
        print(f"Deleting worktree: {path}")
        run_cmd(f"git worktree remove --force {path}")

    run_cmd("git worktree prune")
    print("✓ Worktrees cleaned.")

def delete_branches(branches):
    """Delete specified branches."""
    if not branches:
        return

    for branch in branches:
        print(f"Deleting branch: {branch}")
        run_cmd(f"git branch -D {branch}")

    print("✓ Branches cleaned.")

def main():
    worktrees = get_worktrees_to_delete()
    branches = get_branches_to_delete()

    if not worktrees and not branches:
        print("Nothing to clean up!")
        return

    if confirm_cleanup(worktrees, branches):
        print("\nProceeding with cleanup...\n")
        delete_worktrees(worktrees)
        delete_branches(branches)
        print("\n✓ Done!")
    else:
        print("Cleanup cancelled.")

if __name__ == "__main__":
    main()