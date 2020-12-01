using System;
using System.IO;
using Nov.MaxSamples.Beacons.Container;

namespace Nov.MaxSamples.Beacons
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var task = (new BeaconsProcess()).RunAsync(args);
                task.Wait();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                Console.ReadLine();
            }
        }
    }
}
