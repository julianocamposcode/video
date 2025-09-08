import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
    const auth = req.headers.authorization || '';
    const [type, token] = auth.split(' ');
    if (type != 'Bearer' || !token) {
        return res.status(401).json({ message: 'Token inválido ou inexistente' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'myapp' });
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });     
    }
}

export function authorize (...roles) {
    return (req, res, next) => {
        if(!req.user) return res.status(401).json({ message: 'Usuário não autenticado' });
        if(roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'sem permissão' });     
        }
        next();
    }
}