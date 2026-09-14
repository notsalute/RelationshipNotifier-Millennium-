const KINDS = {
    removed: {
        label: "Unfriended you",
        icon: "minus",
        accent: "#d94141",
        toast: true,
        text: (name) => [name + " unfriended you", "is no longer on your friends list"],
    },
    deleted: {
        label: "Account deleted",
        icon: "minus",
        accent: "#8a8a8a",
        toast: true,
        text: (name) => [name + " is gone", "their Steam profile no longer exists"],
    },
    added: {
        label: "New friend",
        icon: "plus",
        accent: "#5ba32b",
        toast: true,
        text: (name) => [name + " is now your friend", "was added to your friends list"],
    },
    renamed: {
        label: "Name change",
        icon: "pencil",
        accent: "#1a9fff",
        toast: true,
        text: (name, previousName) => [previousName + " changed their name", "now going by " + name],
    },
    selfUnfriended: {
        label: "You unfriended",
        icon: "minus",
        accent: "#8b929a",
        toast: false,
        text: (name) => ["You unfriended " + name, "was removed from your friends list"],
    },
    selfBlocked: {
        label: "You blocked",
        icon: "block",
        accent: "#d98a41",
        toast: false,
        text: (name) => ["You blocked " + name, "can no longer message you"],
    },
    self: {
        label: "You removed",
        icon: "minus",
        accent: "#8b929a",
        toast: false,
        text: (name) => [name + " removed", "you removed or blocked them"],
    },
    test: {
        label: "Test",
        icon: "bell",
        accent: "#8b929a",
        toast: true,
        text: () => ["Test notification", "this is what an alert looks like"],
    },
};

const kindInfo = (kind) => KINDS[kind] || KINDS.test;
