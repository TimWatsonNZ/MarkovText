var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");

gulp.task("js", () =>{
    return gulp.src("src/*.js")
            .pipe(babel())
            .pipe(uglify())
            .pipe(gulp.dest("build"));
});

gulp.task("html", () =>{
    return gulp.src("src/*.html")
            .pipe(gulp.dest("build"));
});

gulp.task("default", ["js", "html"], () =>{
    
});