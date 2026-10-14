package eshop;

import com.intuit.karate.junit5.Karate;

class EshopTest {
    @Karate.Test
    Karate testAll() {
        return Karate.run().relativeTo(getClass());
    }
}
