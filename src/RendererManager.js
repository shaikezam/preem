export default class RendererManager {
    static renderTestTitle(title) {
        let oDate = new Date();
        title = title + ' ' + oDate.toLocaleDateString() + ' ' + oDate.toLocaleTimeString();
        $('body').append('<h1>' + title + '</h1>');
    }
    static renderTestModule(description, index) {
        $('body').append('<div class = "runningTestModule" id = "testModule' + index + '"><div class="testModuleTitle" id = "testModuleTitle' + index + '">' + description + '</div></div>');
    }
    static renderTestModuleTime(index, iTestModuleTime) {
        $('#testModuleTitle' + index).text($('#testModuleTitle' + index).text() + ' ' + iTestModuleTime);
    }
    static renderSingularTest(description, bStatus, index, iSingularTestTime) {
        if (bStatus) {
            $('#testModule' + index).append('<div class = "passSingularTest">' + description + ' ' + iSingularTestTime + '</div>');
            return;
        }
        $('#testModule' + index).append('<div class = "faildSingularTest" id = "testModule' + index + '">' + description + ' ' + iSingularTestTime + '</div>');
    }
}