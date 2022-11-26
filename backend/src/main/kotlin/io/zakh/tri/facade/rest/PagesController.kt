package io.zakh.tri.facade.rest

import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.io.IOException

@RestController
@RequestMapping("pages")
class PagesController(
    @Value("classpath:*")
    private val resources: Array<String>
) {
    @RequestMapping("/")
    @Throws(IOException::class)
    fun home(): String? {
        println("resources")

        for (res in resources) {
            println(res)
        }

        return ""
    }
}