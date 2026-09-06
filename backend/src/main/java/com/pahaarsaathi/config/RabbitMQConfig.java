package com.pahaarsaathi.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${pahaarsaathi.rabbitmq.exchange:landslide.exchange}")
    private String exchange;

    @Value("${pahaarsaathi.rabbitmq.weather-queue:landslide.weather.queue}")
    private String weatherQueue;

    @Value("${pahaarsaathi.rabbitmq.risk-queue:landslide.risk.queue}")
    private String riskQueue;

    @Value("${pahaarsaathi.rabbitmq.alert-queue:landslide.alert.queue}")
    private String alertQueue;

    @Value("${pahaarsaathi.rabbitmq.sms-queue:landslide.sms.queue}")
    private String smsQueue;

    @Bean
    public TopicExchange landslideExchange() {
        return new TopicExchange(exchange);
    }

    @Bean
    public Queue weatherQueueBean() {
        return QueueBuilder.durable(weatherQueue).build();
    }

    @Bean
    public Queue riskQueueBean() {
        return QueueBuilder.durable(riskQueue).build();
    }

    @Bean
    public Queue alertQueueBean() {
        return QueueBuilder.durable(alertQueue).build();
    }

    @Bean
    public Queue smsQueueBean() {
        return QueueBuilder.durable(smsQueue).build();
    }

    @Bean
    public Binding weatherBinding(Queue weatherQueueBean, TopicExchange landslideExchange) {
        return BindingBuilder.bind(weatherQueueBean).to(landslideExchange).with("landslide.weather.#");
    }

    @Bean
    public Binding riskBinding(Queue riskQueueBean, TopicExchange landslideExchange) {
        return BindingBuilder.bind(riskQueueBean).to(landslideExchange).with("landslide.risk.#");
    }

    @Bean
    public Binding alertBinding(Queue alertQueueBean, TopicExchange landslideExchange) {
        return BindingBuilder.bind(alertQueueBean).to(landslideExchange).with("landslide.alert.#");
    }

    @Bean
    public Binding smsBinding(Queue smsQueueBean, TopicExchange landslideExchange) {
        return BindingBuilder.bind(smsQueueBean).to(landslideExchange).with("landslide.alert.sms.#");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
