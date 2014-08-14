define(["base"], function (BaseProcedure) {

	function CommonStartProcedure (nextProcedure) {

        this.frameCount = this.maxFrameNum;

        this.startFrameNum = this.endFrameNum = 1;

        this.moveFrameNum= this.frameCount - this.startFrameNum - this.endFrameNum;        

		this.successor = nextProcedure || null;
	}

	CommonStartProcedure.prototype = Object.create(BaseProcedure, {

        validate: {

            value: function (frame) {

                // TODO: Validate Process
                
                if (--frameCount) {

                }
            }
        }
    });

	return CommonStartProcedure;
})