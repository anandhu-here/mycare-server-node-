const routes = [
    require('./auth/auth'),
    require('./shift')

];


module.exports = function router(app, db){
    return routes.forEach(route=>{
        route(app, db);
    })
}