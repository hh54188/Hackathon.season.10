/*
    GestureBase class:
    手势类型的基类
    其他的手势比如swipe, circle等都继承此类，需要重写部分方法
 */

public abstract class GestureBase
{
    public GestureBase(GestureType type)
    {
        this.CurrentFrameCount = 0;
        this.GestureType = type;
    }
    public bool IsRecognitionStarted { get; set; }

    private int CurrentFrameCount { get; set; }
    
    public GestureType GestureType { get; set; }
    protected virtual int MaximumNumberOfFrameToProcess { 
        get { 
            return 15; 
        } 
    }
    public long GestureTimeStamp { get; set; }
    protected abstract bool ValidateGestureStartCondition(Skeleton skeleton);
    protected abstract bool ValidateGestureEndCondition(Skeleton skeleton);
    protected abstract bool ValidateBaseCondition(Skeleton skeleton);
    protected abstract bool IsGestureValid(Skeleton skeleton);
    public virtual bool CheckForGesture(Skeleton skeleton)
    {
        if (this.IsRecognitionStarted == false)
        {
            if (this.ValidateGestureStartCondition(skeleton))
            {
                this.IsRecognitionStarted = true;
                this.CurrentFrameCount = 0;
            }
        }
        else
        {
            if (this.CurrentFrameCount == this.MaximumNumberOfFrameToProcess)
            {
                this.IsRecognitionStarted = false;
                if (ValidateBaseCondition(skeleton) && ValidateGestureEndCondition(skeleton))
                {
                    return true;
                }
            }
            this.CurrentFrameCount++;
            if (!IsGestureValid(skeleton) && !ValidateBaseCondition(skeleton))
            {
                this.IsRecognitionStarted = false;
            }
        }
    return false;
    }
}

/*
    引擎类：RecognitionEngine.cs

    HOW TO USE:

    recognitionEngine = new GestureRecognitionEngine();
    recognitionEngine.Skeleton = firstSkeleton;
    recognitionEngine.GestureRecognized += new EventHandler<GestureEventArgs>(recognitionEngine_GestureRecognized);
    recognitionEngine.StartRecognize()
*/

public class GestureRecognitionEngine
{
    int SkipFramesAfterGestureIsDetected = 0;
    public event EventHandler<GestureEventArgs> GestureRecognized;
    public GestureType GestureType { get; set; }
    public Skeleton Skeleton { get; set; }

    private void InitilizeGesture()
    {
        this.gestureCollection = new List<GestureBase>();
        this.gestureCollection.Add(new ZoomInGesture());
        this.gestureCollection.Add(new ZoomOutGesture());
        this.gestureCollection.Add(new SwipeToRightGesture());
        this.gestureCollection.Add(new SwipeToLeftGesture());
    }

    public GestureRecognitionEngine()
    {
        this.InitilizeGesture();
    }

    public void StartRecognize()
    {
        if (this.IsGestureDetected)
        {
            while (this.SkipFramesAfterGestureIsDetected <= 30)
            {
                this.SkipFramesAfterGestureIsDetected++;
            }
            this.RestGesture();
            return;
        }

        foreach (var item in this.gestureCollection)
        {
            if (item.CheckForGesture(this.Skeleton))
            {
                if (this.GestureRecognized != null)
                {
                    this.GestureRecognized(this, new GestureEventArgs(RecognitionResult.Success, item.GestureType));
                    this.IsGestureDetected = true;
                }
            }
        }
    }
}

