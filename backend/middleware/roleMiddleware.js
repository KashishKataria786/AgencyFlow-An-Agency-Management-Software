export const authorize = (roles = []) => {
    if (typeof roles === "string") {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            return res.status(403).json({ message: "Forbidden: Access is denied" });
        }
        next();
    };
};

export const isOwner = (req, res, next) => {
    if (req.user && req.user.role === "owner") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Owner access required" });
    }
};

export const isTeamMember = (req, res, next) => {
    if (req.user && (req.user.role === "owner" || req.user.role === "member")) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Team access required" });
    }
};
